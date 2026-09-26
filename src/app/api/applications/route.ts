import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { generateTicketCode } from "@/lib/tickets";
import { sendApplicationEmail } from "@/lib/emails";
import { EDUCATION_LEVELS, TERMS_VERSION } from "@/lib/seedProgram";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXPERIENCE = ["none", "beginner", "some"];
const HFM = ["yes", "no", "unsure"];

function str(v: unknown, max = 200) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function ageFrom(dob: string) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = str(body.name, 120);
    const email = str(body.email, 200).toLowerCase();
    const whatsapp = str(body.whatsapp, 40);
    const dob = str(body.dob, 10);
    const location = str(body.location, 120);
    const experience = str(body.experience, 20);
    const education = str(body.education, 20);
    const hasHfmAccount = str(body.hasHfmAccount, 10);
    const hasBinanceAccount = str(body.hasBinanceAccount, 10);
    const hasMt5Account = str(body.hasMt5Account, 10);

    if (name.length < 2) return bad("Enter your full name.");
    if (!EMAIL_RE.test(email)) return bad("Enter a valid email address.");
    if (!whatsapp) return bad("Enter a WhatsApp number.");
    const age = ageFrom(dob);
    if (age < 0 || age > 120) return bad("Enter a valid date of birth.");
    if (age < 18) return bad("You must be 18 or older to join the program.");
    if (!location) return bad("Enter your city and country.");
    if (!EXPERIENCE.includes(experience)) return bad("Choose your trading experience.");
    if (!EDUCATION_LEVELS.some((l) => l.value === education)) return bad("Choose your highest education level.");
    if (!HFM.includes(hasHfmAccount)) return bad("Tell us whether you have an HFM account.");
    if (!HFM.includes(hasBinanceAccount)) return bad("Tell us whether you have a Binance account.");
    if (!HFM.includes(hasMt5Account)) return bad("Tell us whether you have an MT5 account.");
    if (body.termsAccepted !== true) return bad("You must accept the Terms & Conditions.");
    if (body.termsVersion !== TERMS_VERSION) {
      return bad("The terms have been updated. Refresh the page and review them again.");
    }

    const ref = `SFX-${generateTicketCode(6)}`;
    const application = {
      ref,
      name,
      email,
      whatsapp,
      dob,
      location,
      education,
      experience,
      hasHfmAccount,
      hasBinanceAccount,
      hasMt5Account,
      termsAccepted: true,
      termsVersion: TERMS_VERSION,
      termsAcceptedAt: new Date().toISOString(),
      status: "registered",
      createdAt: new Date().toISOString(),
    };

    // One application per email: the email is the document id, and create()
    // fails atomically if it already exists.
    const doc = getAdminDb().collection("applications").doc(email);
    try {
      await doc.create(application);
    } catch (err) {
      if ((err as { code?: number }).code === 6) {
        const existing = await doc.get();
        return NextResponse.json({ ok: true, alreadyApplied: true, ref: existing.data()?.ref });
      }
      throw err;
    }

    try {
      await sendApplicationEmail(application);
    } catch (emailErr) {
      console.error("Seed application email failed:", emailErr);
    }

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("Seed application failed:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
