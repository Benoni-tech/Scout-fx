import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getEventById } from "@/lib/events";
import { generateTicketCode, sendTicketEmail, Rsvp } from "@/lib/tickets";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { eventId, name, email, whatsapp, source } = await req.json();

    const event = typeof eventId === "string" ? getEventById(eventId) : undefined;
    if (!event) {
      return NextResponse.json({ error: "Unknown event." }, { status: 400 });
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Enter your name." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
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

    const db = getAdminDb();
    const normalizedEmail = email.trim().toLowerCase();

    // One ticket per email per event. Re-registering just re-sends the ticket,
    // and the code isn't returned so nobody can pull up someone else's ticket.
    const existing = await db
      .collection("rsvps")
      .where("eventId", "==", event.id)
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      try {
        await sendTicketEmail({ ...(doc.data() as Omit<Rsvp, "id">), id: doc.id }, event);
      } catch (emailErr) {
        console.error("Resend ticket re-send failed:", emailErr);
      }
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    const rsvp: Rsvp = {
      id: generateTicketCode(),
      eventId: event.id,
      name: name.trim(),
      email: normalizedEmail,
      whatsapp: whatsapp.trim(),
      source: typeof source === "string" ? source : "unknown",
      attended: false,
      checkedInAt: null,
      checkedInBy: null,
      createdAt: new Date().toISOString(),
    };
    const { id, ...data } = rsvp;
    // create() fails if the code already exists, so a collision can't overwrite a ticket.
    await db.collection("rsvps").doc(id).create(data);

    let emailSent = true;
    try {
      await sendTicketEmail(rsvp, event);
    } catch (emailErr) {
      emailSent = false;
      console.error("Resend ticket email failed:", emailErr);
    }

    return NextResponse.json({ ok: true, ticketCode: id, emailSent });
  } catch (err) {
    console.error("RSVP failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
