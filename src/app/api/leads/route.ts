import { NextRequest, NextResponse } from "next/server";
import { readFormBody } from "@/lib/requestGuard";
import { cleanUtm } from "@/lib/utm";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { sendWelcomeEmail } from "@/lib/emails";
import { rateLimit, isHoneypotFilled } from "@/lib/rateLimit";
import { emailError, nameError, normalizeGhanaPhone, phoneError, tidyEmail, tidyName } from "@/lib/validation";
import { claimKeys, takenKeys } from "@/lib/uniqueKeys";

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    const parsed = await readFormBody(req);
    if (parsed.error) return parsed.error;
    const body = parsed.body;
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true });

    const name = tidyName(body.name);
    const email = tidyEmail(body.email);
    const rawPhone = str(body.whatsapp, 40);
    const source = cleanUtm(body.source) || "unknown";

    const invalid = nameError(name) || emailError(email) || phoneError(rawPhone);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
    const whatsapp = normalizeGhanaPhone(rawPhone)!;

    if (!(await rateLimit(req, "leads", { limit: 5, windowSec: 600 }))) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const db = getAdminDb();
    // One member per email: joining again is a no-op (and sends no second welcome email).
    const existing = await db.collection("leads").where("email", "==", email).limit(1).get();
    if (!existing.empty) return NextResponse.json({ ok: true });

    const lead = {
      name,
      email,
      whatsapp,
      source,
      createdAt: new Date().toISOString(),
      referredToHFM: false,
    };
    const ref = db.collection("leads").doc();
    const keys = { email, phone: whatsapp };
    const taken = await db.runTransaction(async (tx) => {
      const taken = await takenKeys(tx, db, "community", keys);
      if (taken.length) return taken;
      tx.create(ref, lead);
      claimKeys(tx, db, "community", keys, ref.path);
      return taken;
    });
    if (taken.includes("phone")) {
      return NextResponse.json(
        { error: "We couldn't complete this registration. If you've registered before, check your email for your confirmation, or message us on WhatsApp for help." },
        { status: 409 }
      );
    }
    if (taken.length) return NextResponse.json({ ok: true });

    try {
      await sendWelcomeEmail(lead.email, lead.name);
    } catch (emailErr) {
      console.error("Resend welcome email failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead capture failed:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
