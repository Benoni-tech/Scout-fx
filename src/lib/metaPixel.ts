// Meta (Facebook) Pixel, used ONLY on event pages to measure the event ads.
// The rest of the site is intentionally not tracked.

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1625374265334329";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let initialized = false;

function enabled() {
  if (typeof window === "undefined" || !META_PIXEL_ID) return false;
  // Keep local test visits out of the ad account's data.
  return !["localhost", "127.0.0.1"].includes(window.location.hostname);
}

/** Meta's base pixel code, run from JS so it's guaranteed to exist before we track. */
function loadPixel() {
  const w = window;
  if (w.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s.parentNode!.insertBefore(t, s);
}

export function initPixel() {
  if (!enabled()) return false;
  loadPixel();
  if (!initialized) {
    window.fbq!("init", META_PIXEL_ID);
    initialized = true;
  }
  return true;
}

/**
 * Track a standard event. Safe to call anywhere: does nothing if the pixel
 * isn't loaded on this page or is blocked. `eventID` lets a future
 * server-side (Conversions API) event be de-duplicated against this one.
 */
export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
  eventID?: string
) {
  if (!enabled() || !initialized || !window.fbq) return;
  if (eventID) window.fbq("track", event, params ?? {}, { eventID });
  else window.fbq("track", event, params ?? {});
}
