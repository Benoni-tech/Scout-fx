import { NextRequest, NextResponse } from "next/server";
import { readFormBody } from "@/lib/requestGuard";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getEventById } from "@/lib/events";
import { generateTicketCode, Rsvp } from "@/lib/tickets";
import { sendTicketEmail } from "@/lib/emails";
import { EmailError } from "@/lib/resend";
import { rateLimit, isHoneypotFilled } from "@/lib/rateLimit";
import { cleanSource, cleanUtm } from "@/lib/utm";
import { emailError, nameError, normalizeGhanaPhone, phoneError, tidyEmail, tidyName } from "@/lib/validation";
import { claimKeys, takenKeys } from "@/lib/uniqueKeys";

const RESEND_COOLDOWN_MS = 15 * 60 * 1000;

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  try {
    const parsed = await readFormBody(req);
    if (parsed.error) return parsed.error;
    const body = parsed.body;
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true, emailSent: true });
    const { eventId } = body;
    const name = tidyName(body.name);
    const email = tidyEmail(body.email);
    const rawPhone = typeof body.whatsapp === "string" ? body.whatsapp.slice(0, 40) : "";
    const source = cleanUtm(body.source) || "unknown";

    const event = typeof eventId === "string" ? getEventById(eventId) : undefined;
    if (!event) return bad("Unknown event.");
    const invalid = nameError(name) || emailError(email) || phoneError(rawPhone);
    if (invalid) return bad(invalid);
    const whatsapp = normalizeGhanaPhone(rawPhone)!;

    if (!(await rateLimit(req, "rsvp", { limit: 5, windowSec: 600 }))) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const db = getAdminDb();

    // One ticket per email per event. Re-registering just re-sends the ticket,
    // and the code isn't returned so nobody can pull up someone else's ticket.
    const existing = await db
      .collection("rsvps")
      .where("eventId", "==", event.id)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      const prev = doc.data();
      // A used or cancelled ticket isn't re-sent, and re-sends are limited to one per
      // 15 minutes so this can't spam an inbox. The reply is the same in every case,
      // so it doesn't reveal anything about the registration.
      const last = Date.parse(prev.lastTicketSentAt ?? prev.createdAt ?? 0) || 0;
      if (!prev.cancelled && !prev.attended && Date.now() - last > RESEND_COOLDOWN_MS) {
        try {
          await sendTicketEmail({ ...(prev as Omit<Rsvp, "id">), id: doc.id }, event);
          const now = new Date().toISOString();
          await doc.ref.update({ lastTicketSentAt: now, ticketEmail: "sent", ticketEmailAt: now, ticketEmailError: null });
        } catch (emailErr) {
          console.error("Resend ticket re-send failed:", emailErr);
        }
      }
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    const rsvp: Rsvp = {
      id: generateTicketCode(),
      eventId: event.id,
      name,
      email,
      whatsapp,
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
    const scope = `event:${event.id}` as const;
    const keys = { email, phone: whatsapp };
    const ref = db.collection("rsvps").doc(id);

    // The ticket and its email/number locks are written together, or not at all.
    const taken = await db.runTransaction(async (tx) => {
      const taken = await takenKeys(tx, db, scope, keys);
      if (taken.length) return taken;
      // create() also fails if the ticket code already exists, so nothing is overwritten.
      tx.create(ref, data);
      claimKeys(tx, db, scope, keys, ref.path);
      return taken;
    });
    if (taken.includes("phone")) {
      // Vague on purpose, so the form can't be used to check whether a number signed up.
      return bad("We couldn't complete this registration. If you've registered before, check your email for your confirmation, or message us on WhatsApp for help.", 409);
    }
    // Same email registered a moment ago in another tab.
    if (taken.includes("email")) return NextResponse.json({ ok: true, alreadyRegistered: true });

    // Record whether the ticket email went out, so admins can see and re-send the ones that didn't.
    let emailSent = true;
    let sendFailure: string | null = null;
    try {
      await sendTicketEmail(rsvp, event);
    } catch (emailErr) {
      emailSent = false;
      sendFailure = emailErr instanceof EmailError ? emailErr.code : "unknown";
      console.error("Resend ticket email failed:", emailErr);
    }
    await ref
      .update({ ticketEmail: emailSent ? "sent" : "failed", ticketEmailAt: new Date().toISOString(), ticketEmailError: sendFailure })
      .catch((e) => console.error("Couldn't record ticket email status:", e));

    return NextResponse.json({ ok: true, ticketCode: id, emailSent });
  } catch (err) {
    console.error("RSVP failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
