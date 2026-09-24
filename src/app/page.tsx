import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Users,
  LineChart,
  Quote,
  CalendarDays,
} from "lucide-react";
import {
  Container,
  Eyebrow,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import DashboardPreview from "@/components/DashboardPreview";
import NewsletterForm from "@/components/NewsletterForm";
import { upcomingEvents } from "@/lib/events";

const pillars = [
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Technical analysis, risk management and trading psychology, written for people who actually want to understand the market, not chase calls.",
    href: "/education",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Live seminars, workshops and an active trader community where questions get answered, not ignored.",
    href: "/events",
  },
  {
    icon: LineChart,
    title: "Signals",
    desc: "Rule-based signals with a public, logged track record: entry, stop and target, every time, no cherry-picking.",
    href: "/signals",
  },
];

const articles = [
  {
    title: "Reading RSI without overreacting to it",
    category: "Technical Analysis",
    slug: "reading-rsi-without-overreacting",
  },
  {
    title: "Position sizing: the part beginners skip",
    category: "Risk Management",
    slug: "position-sizing-basics",
  },
  {
    title: "Why your best trades still feel uncomfortable",
    category: "Trading Psychology",
    slug: "why-good-trades-feel-uncomfortable",
  },
];

const testimonials = [
  {
    quote:
      "First educator I've followed who actually explains the why, not just the buy or sell.",
    name: "Kwabena A.",
    role: "Student, Accra",
  },
  {
    quote:
      "The seminar alone was worth more than three months of random YouTube videos.",
    name: "Efua O.",
    role: "Community member",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="bg-grid relative overflow-hidden pb-20 pt-8">
        <Container className="flex flex-col items-center text-center">
          <Link href="/media-kit">
            <Eyebrow>
              <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
              Check out the media kit
              <ArrowRight className="h-3 w-3" />
            </Eyebrow>
          </Link>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
            Trade smarter with real education and real signals
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
            Structured trading education, an active community and rule-based
            signals with a public track record, built for traders in Ghana
            and beyond.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/join">Join the community</PrimaryButton>
            <SecondaryButton href="/signals">
              See the track record
            </SecondaryButton>
          </div>
        </Container>

        <Container className="mt-14">
          <DashboardPreview />
        </Container>

        <Container className="mt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-ink-300">
            Backed by real, logged monthly KPIs
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-bold text-ink-300">
            <span>250 registrations / mo</span>
            <span>100 active traders</span>
            <span>200 trading lots</span>
            <span>$25K net deposits</span>
          </div>
        </Container>
      </section>

      {/* WHAT I DO */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="What this is"
            title="Three ways to get better at trading"
            subtitle="Not three separate products, one funnel. Learn, get involved, then follow signals with a track record you can actually check."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {pillars.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group rounded-2xl border border-ink-100 bg-white p-6 transition-shadow hover:shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                  <p.icon className="h-5 w-5 text-ink-900" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {p.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-800">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* EDUCATION PREVIEW */}
      <section className="border-t border-ink-100 bg-ink-100/20 py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              center={false}
              eyebrow="Education"
              title="Latest from the library"
            />
            <Link
              href="/education"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800"
            >
              See all articles
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/education/${a.slug}`}
                className="rounded-2xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-card"
              >
                <span className="text-xs font-semibold text-brand-800">
                  {a.category}
                </span>
                <h3 className="mt-2 text-base font-bold leading-snug text-ink-900">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* UPCOMING EVENT */}
      {upcomingEvents.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-card sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-600 text-ink-900">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">
                    {upcomingEvents[0].free ? "Free upcoming event" : "Upcoming event"}
                  </p>
                  <h3 className="text-lg font-bold text-ink-900">
                    {upcomingEvents[0].title}
                  </h3>
                  <p className="text-sm text-ink-500">
                    {upcomingEvents[0].date} · {upcomingEvents[0].location}
                  </p>
                </div>
              </div>
              <SecondaryButton
                href={`/events/${upcomingEvents[0].id}`}
                className="w-full sm:w-auto"
              >
                Reserve a spot
              </SecondaryButton>
            </div>
          </Container>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="border-t border-ink-100 bg-ink-100/20 py-20">
        <Container>
          <SectionHeading eyebrow="From the community" title="What traders say" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-ink-100 bg-white p-6"
              >
                <Quote className="h-5 w-5 text-brand-800" />
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-bold text-ink-900">
                  {t.name}
                </p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HFM CTA BAND */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-brand-600 p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-xl font-extrabold text-ink-900">
                Ready to put the education to work?
              </h3>
              <p className="mt-1 text-sm text-ink-900">
                Open an account with HFM, the broker I trade and teach
                through.
              </p>
            </div>
            <Link
              href="/open-account"
              className="whitespace-nowrap rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-brand-500 shadow-sm transition-colors hover:bg-ink-700"
            >
              Open HFM account
            </Link>
          </div>
        </Container>
      </section>

      {/* NEWSLETTER */}
      <section className="pb-20">
        <Container className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="Stay in the loop"
            title="One email a week. That's it."
            subtitle="Market education, upcoming seminars, and what I'm watching, straight to your inbox."
          />
          <div className="mt-6">
            <NewsletterForm source="home" />
          </div>
        </Container>
      </section>
    </>
  );
}
