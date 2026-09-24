import { randomBytes } from "crypto";
import QRCode from "qrcode";
import { getResend, FROM_EMAIL, REPLY_TO_EMAIL } from "@/lib/resend";
import type { EventItem } from "@/lib/events";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://scoutsfx.com"
).replace(/\/$/, "");

export type Rsvp = {
  id: string; // also the ticket code
  eventId: string;
  name: string;
  email: string;
  whatsapp: string;
  source: string;
  attended: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  createdAt: string;
};

// Unambiguous characters only (no 0/O, 1/I/L) so a code can be read out at the gate.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateTicketCode(length = 10) {
  const bytes = randomBytes(length);
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return code;
}

export function normalizeTicketCode(raw: string) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// The QR opens the staff check-in page. Anyone else who scans it just hits the admin login.
export function checkinUrl(code: string) {
  return `${SITE_URL}/admin/checkin/${code}`;
}

export function ticketUrl(code: string) {
  return `${SITE_URL}/ticket/${code}`;
}

export function ticketQrPng(code: string) {
  return QRCode.toBuffer(checkinUrl(code), {
    type: "png",
    width: 480,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0B0B10", light: "#FFFFFF" },
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

export async function sendTicketEmail(rsvp: Rsvp, event: EventItem) {
  const png = await ticketQrPng(rsvp.id);
  const name = escapeHtml(rsvp.name);

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: rsvp.email,
    replyTo: REPLY_TO_EMAIL,
    subject: `Your ticket: ${event.title}`,
    attachments: [{ filename: `ticket-${rsvp.id}.png`, content: png }],
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color:#0B0B10;">
        <div style="background:#FBFE00; border-radius:16px; padding:20px 24px;">
          <p style="margin:0; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Your ticket</p>
          <h2 style="margin:6px 0 0;">${escapeHtml(event.title)}</h2>
        </div>
        <p style="color:#54545F; line-height:1.6;">
          Hi ${name}, you're registered. Show this QR code at the gate on the day.
          It's also attached to this email so you can open it without internet.
        </p>
        <div style="text-align:center; margin:24px 0;">
          <img src="${SITE_URL}/api/tickets/${rsvp.id}/qr" width="240" height="240" alt="Ticket QR code" style="border:1px solid #E7E7EC; border-radius:12px;" />
          <p style="margin:8px 0 0; font-size:13px; color:#54545F;">Ticket code</p>
          <p style="margin:2px 0 0; font-size:20px; font-weight:800; letter-spacing:0.15em;">${rsvp.id}</p>
        </div>
        <table style="width:100%; font-size:14px; line-height:1.6; border-collapse:collapse;">
          <tr><td style="color:#54545F; padding:4px 0;">When</td><td style="padding:4px 0; font-weight:600;">${escapeHtml(event.date)}</td></tr>
          <tr><td style="color:#54545F; padding:4px 0;">Where</td><td style="padding:4px 0; font-weight:600;">${escapeHtml(event.location)}</td></tr>
          <tr><td style="color:#54545F; padding:4px 0;">Name</td><td style="padding:4px 0; font-weight:600;">${name}</td></tr>
        </table>
        <p style="margin-top:24px;">
          <a href="${ticketUrl(rsvp.id)}" style="display:inline-block; background:#0B0B10; color:#FFFFFF; padding:12px 20px; border-radius:999px; text-decoration:none; font-weight:600; font-size:14px;">View ticket online</a>
        </p>
        <p style="color:#9A9AA5; font-size:12px; line-height:1.6; margin-top:24px;">
          This ticket admits one person and can be used once. Questions? Call ${escapeHtml(event.contactPhone)} or reply to this email.
        </p>
      </div>
    `,
  });
}
