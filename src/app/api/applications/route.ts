import { NextRequest, NextResponse } from "next/server";
import { readFormBody } from "@/lib/requestGuard";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { generateTicketCode } from "@/lib/tickets";
import { sendApplicationEmail } from "@/lib/emails";
import { EDUCATION_LEVELS, TERMS_VERSION } from "@/lib/seedProgram";
import { rateLimit, isHoneypotFilled } from "@/lib/rateLimit";
import { emailError, nameError, normalizeGhanaPhone, phoneError, placeError, tidyEmail, tidyName } from "@/lib/validation";
import { claimKeys, takenKeys } from "@/lib/uniqueKeys";

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
    const parsed = await readFormBody(req);
    if (parsed.error) return parsed.error;
    const body = parsed.body;
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true });
    const name = tidyName(body.name);
    const email = tidyEmail(body.email);
    const rawPhone = str(body.whatsapp, 40);
    const dob = str(body.dob, 10);
    const location = tidyName(body.location);
    const experience = str(body.experience, 20);
    const education = str(body.education, 20);
    const hasHfmAccount = str(body.hasHfmAccount, 10);
    const hasBinanceAccount = str(body.hasBinanceAccount, 10);
    const hasMt5Account = str(body.hasMt5Account, 10);

    const invalid = nameError(name) || emailError(email) || phoneError(rawPhone);
    if (invalid) return bad(invalid);
    const whatsapp = normalizeGhanaPhone(rawPhone)!;
    const age = ageFrom(dob);
    if (age < 0 || age > 120) return bad("Enter a valid date of birth.");
    if (age < 18) return bad("You must be 18 or older to join the program.");
    const badPlace = placeError(location);
    if (badPlace) return bad(badPlace);
    if (!EXPERIENCE.includes(experience)) return bad("Choose your trading experience.");
    if (!EDUCATION_LEVELS.some((l) => l.value === education)) return bad("Choose your highest education level.");
    if (!HFM.includes(hasHfmAccount)) return bad("Tell us whether you have an HFM account.");
    if (!HFM.includes(hasBinanceAccount)) return bad("Tell us whether you have a Binance account.");
    if (!HFM.includes(hasMt5Account)) return bad("Tell us whether you have an MT5 account.");
    if (body.termsAccepted !== true) return bad("You must accept the Terms & Conditions.");
    if (body.termsVersion !== TERMS_VERSION) {
      return bad("The terms have been updated. Refresh the page and review them again.");
    }

    if (!(await rateLimit(req, "applications", { limit: 5, windowSec: 600 }))) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
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

    // One registration per email (the document id) and per WhatsApp number,
    // written together with their locks so duplicates can't race in.
    const db = getAdminDb();
    const doc = db.collection("applications").doc(email);
    const keys = { email, phone: whatsapp };
    const taken = await db.runTransaction(async (tx) => {
      const taken = await takenKeys(tx, db, "seed", keys);
      if (!taken.includes("email") && (await tx.get(doc)).exists) taken.push("email");
      if (taken.length) return taken;
      tx.create(doc, application);
      claimKeys(tx, db, "seed", keys, doc.path);
      return taken;
    });
    // Don't reveal anything about the existing registration to whoever is asking.
    if (taken.includes("email")) return NextResponse.json({ ok: true, alreadyApplied: true });
    if (taken.includes("phone")) {
      return NextResponse.json({ error: "We couldn't complete this registration. If you've registered before, check your email for your confirmation, or message us on WhatsApp for help." }, { status: 409 });
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
