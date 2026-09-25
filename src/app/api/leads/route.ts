import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { sendWelcomeEmail } from "@/lib/emails";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, source } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (!whatsapp || typeof whatsapp !== "string" || !whatsapp.trim()) {
      return NextResponse.json(
        { error: "Enter a WhatsApp number." },
        { status: 400 }
      );
    }

    const lead = {
      name: name || "",
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      source: source || "unknown",
      createdAt: new Date().toISOString(),
      referredToHFM: false,
    };

    await getAdminDb().collection("leads").add(lead);

    try {
      await sendWelcomeEmail(lead.email, lead.name);
    } catch (emailErr) {
      console.error("Resend welcome email failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead capture failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
