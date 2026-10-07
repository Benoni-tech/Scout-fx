import { NextRequest, NextResponse } from "next/server";
import { readFormBody } from "@/lib/requestGuard";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { rateLimit } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISCLOSURE_VERSION = "2026-08-v1";

export async function POST(req: NextRequest) {
  try {
    const parsed = await readFormBody(req);
    if (parsed.error) return parsed.error;
    const { email } = parsed.body;

    if (!email || typeof email !== "string" || email.length > 200 || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!(await rateLimit(req, "disclosure", { limit: 10, windowSec: 600 }))) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await getAdminDb().collection("signalUsers").doc(normalizedEmail).set(
      {
        email: normalizedEmail,
        disclosureAccepted: true,
        disclosureVersion: DISCLOSURE_VERSION,
        acceptedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Disclosure acceptance failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
