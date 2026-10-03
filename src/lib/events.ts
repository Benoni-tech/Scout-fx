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
  speakers?: Speaker[];
  faqs?: Faq[];
  contactPhone: string;
  /** utm_campaign used in this event's share links, e.g. "conference2026". */
  campaign?: string;
};

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
    id: "forex-trading-conference-2026",
    campaign: "conference2026",
    title: "Forex Trading Conference 2026",
    date: "Saturday, October 31, 2026 · 11:00 AM GMT",
    dateISO: "2026-10-31T11:00:00Z",
    location: "Miklin Hotel, Accra",
    free: true,
    presentedBy: "Scout FX × HFM",
    theme: "The Young African & the Global Financial Market",
    description:
      "A full conference on how the global forex market actually works, covering trading sessions, chart reading, risk management, trading economic news, and a live trading session. Free to attend, in person at Miklin Hotel.",
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

export const pastEvents = [
  { title: "Trading Psychology Seminar", date: "July 2026", attendees: 68 },
  { title: "Intro to Forex Meetup", date: "June 2026", attendees: 91 },
];

export function getEventById(id: string) {
  return upcomingEvents.find((e) => e.id === id);
}
