import { randomBytes } from "crypto";
import QRCode from "qrcode";

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
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  /** Who shared the link (speaker or "scoutfx"), from ?ref= */
  ref?: string;
  attended: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  /** Cancelled by an admin: the QR shows "Cancelled" at the gate and can't be admitted. */
  cancelled?: boolean;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  /** Whether the ticket email went out. Missing on registrations from before this was tracked. */
  ticketEmail?: TicketEmailStatus;
  ticketEmailAt?: string;
  ticketEmailError?: string | null;
  createdAt: string;
};

/** "bounced": Resend accepted it but the address doesn't exist (set from Resend's records). */
export type TicketEmailStatus = "sent" | "failed" | "bounced";

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
    color: { dark: "#000000", light: "#FBFE00" },
  });
}
