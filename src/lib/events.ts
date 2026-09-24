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
  contactPhone: string;
};

export const upcomingEvents: EventItem[] = [
  {
    id: "forex-trading-conference-2026",
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
