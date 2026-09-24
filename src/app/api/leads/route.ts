import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getResend, FROM_EMAIL, REPLY_TO_EMAIL } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, source } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (!whatsapp || typeof whatsapp !== "string" || !whatsapp.trim()) {
      return NextResponse.json(
        { error: "Enter a WhatsApp number." },
        { status: 400 }
      );
    }

    const lead = {
      name: name || "",
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      source: source || "unknown",
      createdAt: new Date().toISOString(),
      referredToHFM: false,
    };

    await getAdminDb().collection("leads").add(lead);

    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: lead.email,
        replyTo: REPLY_TO_EMAIL,
        subject: "Welcome to the community",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color:#0B0B10;">You're in${lead.name ? `, ${lead.name}` : ""}</h2>
            <p style="color:#54545F; line-height:1.6;">
              You'll hear about upcoming seminars, new education content,
              and community updates. No spam, unsubscribe anytime.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Resend welcome email failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead capture failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
