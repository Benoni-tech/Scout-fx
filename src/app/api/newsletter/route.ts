import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getResend, FROM_EMAIL, REPLY_TO_EMAIL } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const docRef = getAdminDb().collection("subscribers").doc(normalizedEmail);
    const existing = await docRef.get();

    if (existing.exists) {
      // Already subscribed: treat as success, don't leak whether the
      // email exists to unauthenticated callers beyond a friendly message.
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    await docRef.set({
      email: normalizedEmail,
      source: source || "unknown",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    // Fire the welcome email. Don't let an email failure block the signup;
    // the subscriber is already saved either way.
    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: normalizedEmail,
        replyTo: REPLY_TO_EMAIL,
        subject: "You're in. Welcome",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color:#0B0B10;">Welcome</h2>
            <p style="color:#54545F; line-height:1.6;">
              Thanks for joining. You'll get one email a week covering
              market education, upcoming seminars, and what I'm watching,
              no spam, unsubscribe anytime.
            </p>
            <p style="color:#54545F; line-height:1.6;">
              In the meantime, take a look at the
              <a href="https://scoutsfx.com/education" style="color:#0B0B10;">education library</a>
              or see the
              <a href="https://scoutsfx.com/signals" style="color:#0B0B10;">signal track record</a>.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Resend welcome email failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
