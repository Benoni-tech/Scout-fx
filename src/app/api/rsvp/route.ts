import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { eventId, name, email, whatsapp, source } = await req.json();

    if (!eventId || !name) {
      return NextResponse.json(
        { error: "Missing event or name." },
        { status: 400 }
      );
    }
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

    await adminDb.collection("rsvps").add({
      eventId,
      name,
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      source: source || "unknown",
      attended: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
