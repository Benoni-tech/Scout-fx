import { NextRequest, NextResponse } from "next/server";
import { readFormBody } from "@/lib/requestGuard";
import { cleanSource, cleanUtm } from "@/lib/utm";
import { getAdminDb } from "@/lib/firebaseAdmin";
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
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true, isNew: false });

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
    // Joining again (same email or number) isn't an error: the person is still sent
    // to the WhatsApp group, nothing is saved twice, and isNew stays false so the
    // ad conversion isn't counted a second time.
    const existing = await db.collection("leads").where("email", "==", email).limit(1).get();
    if (!existing.empty) return NextResponse.json({ ok: true, isNew: false });

    const lead = {
      name,
      email,
      whatsapp,
      source,
      utm_source: cleanSource(body.utm_source) || "direct",
      utm_medium: cleanUtm(body.utm_medium),
      utm_campaign: cleanUtm(body.utm_campaign),
      utm_content: cleanUtm(body.utm_content),
      ref: cleanUtm(body.ref),
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
    if (taken.length) return NextResponse.json({ ok: true, isNew: false });

    // No welcome email any more: WhatsApp is the channel.
    return NextResponse.json({ ok: true, isNew: true, id: ref.id });
  } catch (err) {
    console.error("Lead capture failed:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
