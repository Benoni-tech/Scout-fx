import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";
import { getEventById } from "@/lib/events";
import { normalizeTicketCode, type Rsvp } from "@/lib/tickets";
import { sendTicketEmail } from "@/lib/emails";
import { EmailError, isQuotaError } from "@/lib/resend";

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

// POST { eventId }        -> re-send every ticket whose email failed (not cancelled)
// POST { eventId, code }  -> re-send one ticket
// Sends one at a time and stops at the first quota error, so it never burns
// through the daily limit; the rest stay "failed" for the next try.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const event = typeof body.eventId === "string" ? getEventById(body.eventId) : undefined;
  if (!event) return NextResponse.json({ error: "Unknown event." }, { status: 400 });

  const db = getAdminDb();
  const code = typeof body.code === "string" ? normalizeTicketCode(body.code) : "";
  const docs = code
    ? [await db.collection("rsvps").doc(code).get()].filter((d) => d.exists && d.data()!.eventId === event.id)
    : (await db.collection("rsvps").where("eventId", "==", event.id).where("ticketEmail", "==", "failed").get()).docs;
  const queue = docs.filter((d) => !d.data()!.cancelled);
  if (code && !queue.length) return NextResponse.json({ error: "Ticket not found or cancelled." }, { status: 404 });

  let sent = 0;
  let failed = 0;
  let stoppedAtLimit = false;
  for (const doc of queue) {
    const now = new Date().toISOString();
    try {
      await sendTicketEmail({ ...(doc.data() as Omit<Rsvp, "id">), id: doc.id }, event);
      await doc.ref.update({ ticketEmail: "sent", ticketEmailAt: now, ticketEmailError: null, lastTicketSentAt: now });
      sent++;
    } catch (err) {
      failed++;
      await doc.ref.update({ ticketEmail: "failed", ticketEmailAt: now, ticketEmailError: err instanceof EmailError ? err.code : "unknown" });
      if (isQuotaError(err)) {
        stoppedAtLimit = true;
        break;
      }
    }
    await pause(250); // Resend allows a handful of requests per second
  }

  return NextResponse.json({ ok: true, sent, failed, remaining: queue.length - sent, stoppedAtLimit });
}
