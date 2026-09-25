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
    color: { dark: "#000000", light: "#FBFE00" },
  });
}
