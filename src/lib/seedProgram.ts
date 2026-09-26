import type { Faq } from "@/lib/events";

// Everything editable about the Seed Program lives here: copy, amounts,
// FAQ and the Terms & Conditions shown in the application modal.

export const SEED_PROGRAM = {
  name: "Scout FX Seed Program",
  seedAmount: 50,
  currency: "USD",
};

/**
 * Bump this whenever the terms below change. Each application stores the
 * version the applicant accepted, so you always know which terms applied.
 */
export const TERMS_VERSION = "2026-09-26.2";

export type TermsSection = { heading: string; body: string[] };

// DRAFT: have these reviewed before launch (see notes in the handover).
export const seedTerms: TermsSection[] = [
  {
    heading: "1. About the program",
    body: [
      "The Scout FX Seed Program (the \"Program\") is a trading education program run by Scout FX. Every eligible participant who registers receives free trading education. In addition, Scout FX may award some participants a one-time seed capital allocation of up to USD 50 to practise what they learn in a live market.",
      "Registering for the Program guarantees a place in the training only. It does not guarantee seed capital.",
      "The Program is educational. Nothing in the Program, its training sessions or community channels is financial or investment advice.",
    ],
  },
  {
    heading: "2. Eligibility",
    body: [
      "You must be at least 18 years old, able to open a trading account in your own name, and able to provide valid identification if asked.",
      "One application per person. Duplicate, false or incomplete applications may be rejected.",
    ],
  },
  {
    heading: "3. Registration and training",
    body: [
      "Every eligible person who registers is guaranteed a place in the free training. Scout FX will contact you with the training schedule by email or WhatsApp.",
      "Scout FX may set the dates, format and location of the training, and may move you to a later training group if a session is full.",
    ],
  },
  {
    heading: "4. Seed capital is not guaranteed",
    body: [
      "Registration and completing the training do not entitle you to seed capital. Scout FX reserves the right to decide, at its sole discretion, whether to award seed capital, to whom, how much (up to USD 50), and when.",
      "In making that decision Scout FX may consider, among other things, training attendance, assessment results, conduct, and the number of awards available at the time. Scout FX does not have to give reasons for its decisions, and its decision is final.",
      "Scout FX may also limit, pause or stop seed capital awards at any time without affecting your place in the training.",
    ],
  },
  {
    heading: "5. Seed capital",
    body: [
      "If you are awarded seed capital, it is a one-time allocation of up to USD 50 (or its equivalent), credited to a trading account opened in your name with HFM, the broker Scout FX trades and teaches through.",
      "Seed capital is provided for trading only. It is non-transferable, cannot be exchanged for cash, and cannot be withdrawn. Any profits you make on top of the seed capital may be withdrawn in line with the broker's normal rules.",
      "Scout FX will not top up, replace or refund seed capital that is lost through trading.",
    ],
  },
  {
    heading: "6. Risk warning",
    body: [
      "Trading forex, gold, crypto and other leveraged products carries a high level of risk. You can lose some or all of the seed capital, and any of your own money you choose to add. Past performance is not a guide to future results and no profit is guaranteed.",
      "You are responsible for every trade placed on your account and for any money you deposit yourself.",
    ],
  },
  {
    heading: "7. Conduct",
    body: [
      "Participants must treat trainers and other members with respect. Scout FX may remove you from the Program, and withdraw any seed capital that has not yet been traded, if you give false information, misuse the Program or its funds, or behave abusively.",
    ],
  },
  {
    heading: "8. Your information",
    body: [
      "We store the details you submit to run the Program, assess your application and contact you by email or WhatsApp about it. We do not sell your information. You can ask us to delete your application at any time by contacting us.",
    ],
  },
  {
    heading: "9. Affiliate disclosure",
    body: [
      "Scout FX is an HFM affiliate (Affiliate ID: 30537791) and may earn a commission when participants open or trade on an HFM account. This does not change the cost of trading for you.",
    ],
  },
  {
    heading: "10. Changes to the Program",
    body: [
      "Scout FX may change, pause or end the Program, or update these terms, at any time. Changes do not affect seed capital already credited to your account.",
    ],
  },
  {
    heading: "11. Contact",
    body: [
      "Questions about the Program or these terms can be sent to hello@scoutsfx.com or on WhatsApp at +233 54 462 4401.",
    ],
  },
];

export const seedFaqs: Faq[] = [
  {
    q: "If I register, am I guaranteed a place?",
    a: "Yes, a place in the free training is guaranteed for every eligible person who registers. Seed capital is separate and is not guaranteed.",
  },
  {
    q: "Is the $50 seed capital guaranteed?",
    a: "No. Scout FX decides, at its discretion, who receives seed capital and how much (up to $50), based on things like training attendance, assessment results and conduct. Registering or finishing the training doesn't automatically qualify you.",
  },
  {
    q: "Do I need trading experience?",
    a: "No. The program is built for beginners. We start with how the market works and build up to placing and managing your first trades.",
  },
  {
    q: "Is it free?",
    a: "Yes. Registration and training are free. You don't pay anything to join.",
  },
  {
    q: "If I'm awarded seed capital, can I withdraw it?",
    a: "No, the seed capital itself is for trading only. Profits you make on top of it can be withdrawn under the broker's normal rules. See the Terms & Conditions for details.",
  },
  {
    q: "What happens if I lose the seed capital?",
    a: "That's part of learning, and it's why we start small. You won't owe us anything, but the seed capital is not replaced.",
  },
];

/** Admin workflow for a registration. Seed capital is only ever a decision at the end. */
export const SEED_STATUSES = [
  { value: "registered", label: "Registered" },
  { value: "in_training", label: "In training" },
  { value: "training_complete", label: "Training complete" },
  { value: "seed_awarded", label: "Seed awarded" },
  { value: "seed_not_awarded", label: "Seed not awarded" },
] as const;

export const EDUCATION_LEVELS = [
  { value: "jhs", label: "Junior High (BECE)" },
  { value: "shs", label: "Senior High (WASSCE)" },
  { value: "diploma", label: "Diploma / HND" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "postgrad", label: "Master's or higher" },
  { value: "other", label: "Other" },
] as const;

export const YES_NO_UNSURE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
] as const;

export type SeedStatus = (typeof SEED_STATUSES)[number]["value"];
