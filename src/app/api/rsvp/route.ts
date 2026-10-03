import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getEventById } from "@/lib/events";
import { generateTicketCode, Rsvp } from "@/lib/tickets";
import { sendTicketEmail } from "@/lib/emails";
import { rateLimit, isHoneypotFilled } from "@/lib/rateLimit";
import { cleanSource, cleanUtm } from "@/lib/utm";

const RESEND_COOLDOWN_MS = 15 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true, emailSent: true });
    const { eventId } = body;
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim().slice(0, 40) : "";
    const source = typeof body.source === "string" ? body.source.slice(0, 40) : "unknown";

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

    if (!(await rateLimit(req, "rsvp", { limit: 5, windowSec: 600 }))) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
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
      // Re-send at most every 15 minutes so this can't be used to spam an inbox.
      const last = Date.parse(doc.data().lastTicketSentAt ?? doc.data().createdAt ?? 0) || 0;
      if (Date.now() - last > RESEND_COOLDOWN_MS) {
        try {
          await sendTicketEmail({ ...(doc.data() as Omit<Rsvp, "id">), id: doc.id }, event);
          await doc.ref.update({ lastTicketSentAt: new Date().toISOString() });
        } catch (emailErr) {
          console.error("Resend ticket re-send failed:", emailErr);
        }
      }
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    const rsvp: Rsvp = {
      id: generateTicketCode(),
      eventId: event.id,
      name: name.trim(),
      email: normalizedEmail,
      whatsapp: whatsapp.trim(),
      source,
      utm_source: cleanSource(body.utm_source) || "direct",
      utm_medium: cleanUtm(body.utm_medium),
      utm_campaign: cleanUtm(body.utm_campaign),
      utm_content: cleanUtm(body.utm_content),
      ref: cleanUtm(body.ref),
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
