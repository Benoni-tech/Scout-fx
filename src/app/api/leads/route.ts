import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { sendWelcomeEmail } from "@/lib/emails";
import { rateLimit, isHoneypotFilled } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true });

    const name = str(body.name, 120);
    const email = str(body.email, 200).toLowerCase();
    const whatsapp = str(body.whatsapp, 40);
    const source = str(body.source, 40) || "unknown";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!whatsapp) {
      return NextResponse.json({ error: "Enter a WhatsApp number." }, { status: 400 });
    }

    if (!(await rateLimit(req, "leads", { limit: 5, windowSec: 600 }))) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const db = getAdminDb();
    // One lead per email: joining again is a no-op (and sends no second welcome email).
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
    await db.collection("leads").add(lead);

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
