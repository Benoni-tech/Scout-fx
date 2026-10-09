// Form rules shared by the browser (instant feedback) and the API routes (the real gate).
// Registrations are open to Ghana-based participants, enforced by the WhatsApp number.

// Ghana mobile prefixes, without the leading 0 (MTN, Telecel, AT, Glo).
const GHANA_PREFIXES = ["20", "23", "24", "25", "26", "27", "28", "50", "53", "54", "55", "56", "57", "59"];

export const PHONE_HELP = "Ghana numbers only: 10 digits, e.g. 024 123 4567.";

/**
 * "024 123 4567", "24 123 4567", "+233 24 123 4567" or "00233..." -> "+233241234567".
 * Null for anything that isn't a 10-digit Ghana mobile number.
 */
export function normalizeGhanaPhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("233")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 9 || !GHANA_PREFIXES.includes(d.slice(0, 2))) return null;
  return `+233${d}`;
}

export function phoneError(raw: string) {
  if (!raw.trim()) return "Enter your WhatsApp number.";
  const digits = raw.replace(/\D/g, "");
  if (/^\+/.test(raw.trim()) && !digits.startsWith("233")) {
    return "Registration is open to Ghana numbers only (+233).";
  }
  return normalizeGhanaPhone(raw) ? "" : `Check your number. ${PHONE_HELP}`;
}

/** Trims and collapses spaces. */
export function tidyName(raw: unknown) {
  return typeof raw === "string" ? raw.trim().replace(/\s+/g, " ").slice(0, 80) : "";
}

export function nameError(raw: string) {
  const name = tidyName(raw);
  if (!name) return "Enter your full name.";
  if (/https?:|www\.|@|\d/i.test(name)) return "Your name can only contain letters.";
  if (!/^[\p{L}][\p{L}'’.\- ]*$/u.test(name)) return "Your name can only contain letters, spaces, hyphens and apostrophes.";
  const words = name.split(" ").filter((w) => /\p{L}{2,}/u.test(w));
  if (words.length < 2) return "Enter your first and last name.";
  // Keyboard junk like "ddd dddd": the same letter 3+ times in a row, or a 3+ letter
  // word with no vowel. Real names ("Nana Ama Nkrumah", "Ng") still pass.
  if (/(\p{L})\1\1/iu.test(name) || words.some((w) => w.length >= 3 && !/[aeiouyàáâãäåèéêëìíîïòóôõöùúûüýɛɔ]/i.test(w))) {
    return "Enter your real first and last name.";
  }
  return "";
}

/** City/town, e.g. "Accra" or "Kumasi, Ashanti". Letters and simple punctuation only. */
export function placeError(raw: string) {
  const place = tidyName(raw);
  if (place.length < 2) return "Enter your city or town.";
  if (!/^[\p{L}][\p{L}'’.,\- ]*$/u.test(place)) return "Your city can only contain letters, spaces and commas.";
  return "";
}

/** Same person typed slightly differently ("kwame  MENSAH") gives the same key. */
export function nameKey(raw: unknown) {
  return tidyName(raw).toLowerCase().replace(/[^\p{L} ]/gu, "");
}

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

// Throwaway inboxes: tickets and follow-ups sent there are never read.
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "getnada.com", "sharklasers.com", "dispostable.com",
  "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mailnesia.com", "mohmal.com",
]);

// Common slips on the domains most people here use.
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com",
  "gnail.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmaill.com": "gmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com", "iclod.com": "icloud.com", "icoud.com": "icloud.com",
};

export function tidyEmail(raw: unknown) {
  return typeof raw === "string" ? raw.trim().toLowerCase().slice(0, 200) : "";
}

export function emailError(raw: string) {
  const email = tidyEmail(raw);
  if (!email) return "Enter your email address.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  const domain = email.split("@")[1];
  if (DISPOSABLE.has(domain)) return "Use your personal email, not a temporary inbox.";
  if (TYPOS[domain]) return `Check your email: did you mean ${email.split("@")[0]}@${TYPOS[domain]}?`;
  return "";
}

/** The corrected address when the domain looks like a typo, for a "Did you mean" hint. */
export function emailSuggestion(raw: string) {
  const email = tidyEmail(raw);
  const [user, domain] = email.split("@");
  return domain && TYPOS[domain] ? `${user}@${TYPOS[domain]}` : "";
}
