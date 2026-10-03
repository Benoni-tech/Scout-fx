// Where a registration came from (WhatsApp broadcast, Facebook ad, direct...).
// Read from the landing URL's utm_* tags and kept for the browser tab's session,
// so it survives the visitor clicking around before they register.

export type Utm = { utm_source: string; utm_medium: string; utm_campaign: string };

const KEY = "sfx_utm";

/** Lowercase, short, and only safe characters. Used on both client and server. */
export function cleanUtm(v: unknown) {
  if (typeof v !== "string") return "";
  return v.trim().toLowerCase().replace(/[^a-z0-9_.\-]+/g, "_").slice(0, 60);
}

// Common shorthands people type into utm_source, mapped to one name each.
const ALIASES: Record<string, string> = {
  fb: "facebook", meta: "facebook", ig: "instagram", insta: "instagram",
  wa: "whatsapp", li: "linkedin", yt: "youtube", tg: "telegram",
  twitter: "x", tt: "tiktok",
};

/** Clean a source name and fold shorthands (fb, ig, wa...) into one spelling. */
export function cleanSource(v: unknown) {
  const s = cleanUtm(v);
  return ALIASES[s] ?? s;
}

/** Display names for the admin. Anything else is shown as stored. */
export const SOURCE_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp", facebook: "Facebook", instagram: "Instagram",
  google: "Google", linkedin: "LinkedIn", youtube: "YouTube", tiktok: "TikTok",
  x: "X (Twitter)", telegram: "Telegram", snapchat: "Snapchat", bing: "Bing",
  email: "Email", direct: "Direct",
};

const REFERRERS: [RegExp, string][] = [
  [/(^|\.)(facebook|fb)\.com$/, "facebook"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "whatsapp"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin"],
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, "x"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(t\.me|telegram\.org)$/, "telegram"],
  [/(^|\.)snapchat\.com$/, "snapchat"],
];

// Click IDs platforms add to outgoing links (not only ads). Used when the referrer says nothing.
const CLICK_IDS: [string, string][] = [
  ["gclid", "google"], ["gbraid", "google"], ["wbraid", "google"],
  ["li_fat_id", "linkedin"], ["ttclid", "tiktok"], ["twclid", "x"],
  ["msclkid", "bing"], ["fbclid", "facebook"],
];

// Untagged visits: make a best guess from the referring site, then click IDs.
function guessSource(params: URLSearchParams): Utm | null {
  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {}
  const external = host && host !== window.location.hostname;
  // Checked first so an Instagram click (which also carries fbclid) isn't counted as Facebook.
  const hit = external ? REFERRERS.find(([re]) => re.test(host)) : undefined;
  const clickId = CLICK_IDS.find(([p]) => params.get(p));
  if (hit) return { utm_source: hit[1], utm_medium: clickId ? "" : "referral", utm_campaign: "" };
  if (clickId) return { utm_source: clickId[1], utm_medium: "", utm_campaign: "" };
  if (external) return { utm_source: cleanUtm(host), utm_medium: "referral", utm_campaign: "" };
  return null;
}

/** Call on page load. Returns the visitor's source, defaulting to "direct". */
export function captureUtm(): Utm {
  const params = new URLSearchParams(window.location.search);
  let found: Utm | null = null;
  if (params.get("utm_source")) {
    found = {
      utm_source: cleanSource(params.get("utm_source")),
      utm_medium: cleanUtm(params.get("utm_medium")),
      utm_campaign: cleanUtm(params.get("utm_campaign")),
    };
  }

  try {
    // Tagged links always win. Otherwise keep what the session first arrived with.
    if (!found) {
      const saved = sessionStorage.getItem(KEY);
      if (saved) return JSON.parse(saved) as Utm;
      found = guessSource(params);
    }
    if (found) sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // storage blocked (private mode etc.): just use what's in the URL
    found = found ?? guessSource(params);
  }

  return found ?? { utm_source: "direct", utm_medium: "", utm_campaign: "" };
}
