import { safeWhatsAppInvite } from "@/lib/whatsapp";

export type Speaker = {
  name: string;
  role: string;
  tag: "Host" | "Speaker";
  photo: string;
  bio: string;
};

export type Lesson = {
  title: string;
  blurb: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type HeroImage = {
  src: string;
  alt: string;
  /** CSS object-position, to keep faces in frame when the photo is cropped. */
  position?: string;
  /** Portrait photo (3:4), for galleries. */
  tall?: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  dateISO?: string;
  location: string;
  spotsLeft?: number;
  free?: boolean;
  presentedBy?: string;
  theme?: string;
  description: string;
  agenda?: Lesson[];
  /** Full-width photo hero (crossfades between them). Without it the page uses the plain hero. */
  hero?: { images: HeroImage[]; caption?: string };
  /**
   * Shown instead of the registration page once the event is over: a short write-up
   * and a photo gallery (headline numbers come from the tickets themselves).
   */
  report?: { summary: string[]; gallery: HeroImage[] };
  /** Photo panel beside the registration form (crossfades), with a headline over it. */
  signup?: { images: HeroImage[]; headline: string; text?: string };
  /** One line under the lessons heading. */
  agendaIntro?: string;
  speakers?: Speaker[];
  faqs?: Faq[];
  contactPhone: string;
  /** utm_campaign used in this event's share links, e.g. "conference2026". */
  campaign?: string;
  /**
   * WhatsApp Community invite for registrants (reminders and updates). Shown after
   * registering and in the ticket email. If it leaks, reset it in WhatsApp and paste
   * the new one here.
   */
  whatsappCommunityUrl?: string;
};

/** The event's WhatsApp invite, only if it's a genuine WhatsApp link (otherwise nothing is shown). */
export function whatsappInvite(event: Pick<EventItem, "whatsappCommunityUrl">) {
  return safeWhatsAppInvite(event.whatsappCommunityUrl);
}

/** Short id used in a sharer's ?ref= link, e.g. "dr-newman" (from the photo file name). */
export function speakerRef(s: Speaker) {
  const fromPhoto = s.photo.split("/").pop()?.replace(/\.[a-z]+$/i, "");
  return fromPhoto || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Everyone who gets their own share link for an event: Scout FX plus each speaker. */
export function eventSharers(event: EventItem) {
  return [
    { ref: "scoutfx", name: "Scout FX" },
    ...(event.speakers ?? []).map((s) => ({ ref: speakerRef(s), name: s.name })),
  ];
}

export const upcomingEvents: EventItem[] = [
  {
    id: "practical-forex-conference-dec-2026",
    campaign: "practical-dec2026",
    title: "Practical Forex Conference",
    date: "Saturday, December 5, 2026 · 11:00 AM GMT",
    dateISO: "2026-12-05T11:00:00Z",
    location: "Kakalika Plaza, Spintex, Accra",
    free: true,
    presentedBy: "Scout FX × HFM",
    description:
      "A hands-on forex conference with Coach Emma: the risk management and trading psychology that keep you in the game, then a practical trading session on real charts. Free to attend, in person at Kakalika Plaza, Spintex.",
    hero: {
      images: [
        { src: "/events/forex-trading-conference-2026/photo-audience.webp", alt: "Attendees listening at the Scout FX Forex Trading Conference", position: "50% 40%" },
        { src: "/events/forex-trading-conference-2026/photo-panel.webp", alt: "Speakers at the Scout FX conference table", position: "65% 45%" },
        { src: "/events/forex-trading-conference-2026/photo-front-row.webp", alt: "Attendees at the Scout FX Forex Trading Conference", position: "60% 35%" },
      ],
      caption: "Photos from our October 2026 conference",
    },
    signup: {
      images: [
        { src: "/events/forex-trading-conference-2026/tall-hands.webp", alt: "Attendees raising their hands at the Scout FX conference" },
        { src: "/events/forex-trading-conference-2026/tall-speaker.webp", alt: "A speaker walking to the stage at the Scout FX conference" },
        { src: "/events/forex-trading-conference-2026/tall-stage.webp", alt: "Speakers at the front of the room at the Scout FX conference" },
      ],
      headline: "Learn it. Practise it. Trade it.",
      text: "Real charts, real risk rules and a room full of traders like you. This is our last conference; the next seat is yours.",
    },
    agendaIntro: "What we'll cover on the day: the risk and mindset rules behind every trade, then trading it for real.",
    agenda: [
      {
        title: "Risk Management",
        blurb: "How much to risk per trade, where to put your stop, and sizing positions so one loss never wipes you out.",
      },
      {
        title: "Trading Psychology",
        blurb: "Handling fear, greed and the urge to revenge-trade, and building habits that keep you disciplined.",
      },
      {
        title: "Practical Trading Session",
        blurb: "Real setups worked through on live charts, from spotting the trade to entry, stop-loss and exit.",
      },
    ],
    speakers: [
      {
        name: "Coach Emma",
        role: "Financial Market Expert",
        tag: "Host",
        photo: "/speakers/coach-emma.jpg",
        bio: "Coach Emma leads the whole day, taking you through live trades step by step and the risk and mindset rules behind them, with time for your questions.",
      },
    ],
    faqs: [
      {
        q: "Is the conference really free?",
        a: "Yes. Entry is free, but you need to register so we can reserve your seat and send your ticket.",
      },
      {
        q: "Where and when is it?",
        a: "Saturday, December 5, 2026 at 11:00 AM GMT, at Kakalika Plaza, Spintex. Arriving 20–30 minutes early makes check-in smoother.",
      },
      {
        q: "How do I get my ticket?",
        a: "Once you register, a ticket with a QR code is emailed to you and saved on your ticket page. Show the QR code at the gate; it works offline too.",
      },
      {
        q: "I've never traded before. Is this for me?",
        a: "Yes. Everything is shown step by step on real charts, and the risk management and psychology sessions are useful whatever your level.",
      },
      {
        q: "Should I bring anything?",
        a: "A phone or laptop with a trading app (or a demo account) helps you follow along, but it isn't required.",
      },
      {
        q: "Can I bring a friend?",
        a: "Please ask them to register separately. Every attendee needs their own ticket to get in.",
      },
      {
        q: "Who do I contact with questions?",
        a: "Message us on WhatsApp at +233 54 462 4401 and we'll get back to you.",
      },
    ],
    contactPhone: "+233 54 462 4401",
  },
  {
    id: "forex-trading-conference-2026",
    campaign: "conference2026",
    hero: {
      images: [
        { src: "/events/forex-trading-conference-2026/photo-hands.webp", alt: "Attendees raising their hands at the Scout FX Forex Trading Conference", position: "50% 45%" },
        { src: "/events/forex-trading-conference-2026/photo-audience.webp", alt: "Attendees listening at the Scout FX Forex Trading Conference", position: "50% 40%" },
        { src: "/events/forex-trading-conference-2026/photo-panel.webp", alt: "Speakers at the Scout FX conference table", position: "65% 45%" },
      ],
    },
    report: {
      summary: [
        "On Saturday, October 31, 2026, Scout FX and HFM brought traders together at Miklin Hotel in Accra for a full day on how the forex market really works.",
        "Coach Emma, Isaac Gyasi of HFM and Dr. Newman led six sessions, from how the global market works and when it moves, through chart reading, risk management and trading the news, to a live trading session.",
        "Thank you to everyone who registered and came. If you missed it, the next one is your chance.",
      ],
      gallery: [
        { src: "/events/forex-trading-conference-2026/photo-arrival.webp", alt: "Attendees checking in at the Scout FX and HFM welcome table" },
        { src: "/events/forex-trading-conference-2026/tall-venue.webp", alt: "The Scout FX banner outside Miklin Hotel", tall: true },
        { src: "/events/forex-trading-conference-2026/photo-hands.webp", alt: "Attendees raising their hands to answer a question" },
        { src: "/events/forex-trading-conference-2026/photo-room.webp", alt: "The conference room with the screen and the Scout FX banner" },
        { src: "/events/forex-trading-conference-2026/photo-listening.webp", alt: "Attendees listening to a session" },
        { src: "/events/forex-trading-conference-2026/tall-speaker.webp", alt: "A speaker walking to the stage", tall: true },
        { src: "/events/forex-trading-conference-2026/photo-rows.webp", alt: "The front rows during a session" },
        { src: "/events/forex-trading-conference-2026/photo-panel.webp", alt: "Speakers at the conference table" },
        { src: "/events/forex-trading-conference-2026/photo-front-row.webp", alt: "Attendees in the front row" },
        { src: "/events/forex-trading-conference-2026/photo-stage.webp", alt: "A speaker with the microphone at the front of the room" },
      ],
    },
    whatsappCommunityUrl: "https://chat.whatsapp.com/GDOwmuvQq4KE0kgOyIe6x9",
    title: "Forex Trading Conference 2026",
    date: "Saturday, October 31, 2026 · 11:00 AM GMT",
    dateISO: "2026-10-31T11:00:00Z",
    location: "Miklin Hotel, Accra",
    free: true,
    presentedBy: "Scout FX × HFM",
    theme: "The Young African & the Global Financial Market",
    description:
      "A full conference on how the global forex market actually works, covering trading sessions, chart reading, risk management, trading economic news, and a live trading session. Free to attend, in person at Miklin Hotel.",
    agendaIntro: "What we'll cover on the day, from the fundamentals of the market to a live trading session.",
    agenda: [
      {
        title: "Introduction to Forex Trading: How the Global Market Works",
        blurb:
          "What forex actually is, who trades it, and how price moves between currency pairs.",
      },
      {
        title: "Understanding Trading Sessions",
        blurb:
          "Why the Asian, London and New York sessions each behave differently, and when volume actually shows up.",
      },
      {
        title: "How to Read a Forex Chart",
        blurb:
          "Candlesticks, timeframes and the handful of chart elements that actually matter.",
      },
      {
        title: "Risk Management & Market Psychology",
        blurb:
          "Position sizing, stop-loss placement, and staying disciplined when a trade goes against you.",
      },
      {
        title: "How to Trade Economic News",
        blurb:
          "Reading an economic calendar and trading around high-impact releases without getting blown out.",
      },
      {
        title: "Live Trading Session",
        blurb: "A real trade walked through live, from setup to entry to exit.",
      },
    ],
    speakers: [
      {
        name: "Coach Emma",
        role: "Financial Market Expert",
        tag: "Host",
        photo: "/speakers/coach-emma.jpg",
        bio: "Coach Emma hosts the conference and leads on financial market fundamentals, helping first-time attendees follow along from the basics up.",
      },
      {
        name: "Isaac Gyasi",
        role: "Business Development Manager (HFM)",
        tag: "Speaker",
        photo: "/speakers/isaac-gyasi.jpg",
        bio: "Isaac Gyasi works in business development at HFM and speaks on how the broker side of the market works: execution, regulation, and what to look for when choosing where to trade.",
      },
      {
        name: "Dr. Newman",
        role: "Trader",
        tag: "Speaker",
        photo: "/speakers/dr-newman.jpg",
        bio: "Dr. Newman is an active trader leading the risk management and live trading portions of the conference, walking attendees through a real setup from entry to exit.",
      },
    ],
    faqs: [
      {
        q: "Is the conference really free?",
        a: "Yes. Entry is free, but you need to register so we can reserve your seat and send your ticket.",
      },
      {
        q: "Where and when is it?",
        a: "Saturday, October 31, 2026 at 11:00 AM GMT, at Miklin Hotel in Accra. Arriving 20–30 minutes early makes check-in smoother.",
      },
      {
        q: "How do I get my ticket?",
        a: "Once you register, a ticket with a QR code is emailed to you and saved on your ticket page. Show the QR code at the gate; it works offline too.",
      },
      {
        q: "I've never traded before. Is this for me?",
        a: "Yes. The day starts from how the forex market works and builds up to chart reading, risk management and a live trading session.",
      },
      {
        q: "Can I bring a friend?",
        a: "Please ask them to register separately. Every attendee needs their own ticket to get in.",
      },
      {
        q: "Who do I contact with questions?",
        a: "Message us on WhatsApp at +233 54 462 4401 and we'll get back to you.",
      },
    ],
    contactPhone: "+233 54 462 4401",
  },
];

/** True once the event day is over (8 hours after the start), so registration closes by itself. */
export function eventIsOver(event: Pick<EventItem, "dateISO">, now = Date.now()) {
  return !!event.dateISO && now > Date.parse(event.dateISO) + 8 * 3_600_000;
}

export function getEventById(id: string) {
  return upcomingEvents.find((e) => e.id === id);
}
