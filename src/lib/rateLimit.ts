import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

/**
 * Fixed-window rate limit backed by Firestore, so it works across serverless
 * instances. Only a salted hash of the IP is stored, never the address itself.
 * Returns true if the request is allowed.
 */
export async function rateLimit(
  req: NextRequest,
  bucket: string,
  { limit, windowSec }: { limit: number; windowSec: number }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const salt = process.env.FIREBASE_PROJECT_ID || "scoutfx";
  const key = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
  const ref = getAdminDb().collection("rateLimits").doc(`${bucket}_${key}`);
  const now = Date.now();

  try {
    return await getAdminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const d = snap.data() as { count: number; windowStart: number } | undefined;
      if (!d || now - d.windowStart > windowSec * 1000) {
        tx.set(ref, { count: 1, windowStart: now, expireAt: new Date(now + windowSec * 1000) });
        return true;
      }
      if (d.count >= limit) return false;
      tx.update(ref, { count: d.count + 1 });
      return true;
    });
  } catch (err) {
    // Never block real users because the limiter itself failed.
    console.error("Rate limit check failed:", err);
    return true;
  }
}

/** Bots fill every field; humans never see this one. */
export function isHoneypotFilled(body: unknown) {
  const v = (body as { company?: unknown })?.company;
  return typeof v === "string" && v.trim() !== "";
}
