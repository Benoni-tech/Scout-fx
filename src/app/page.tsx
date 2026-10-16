import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Users,
  CalendarDays,
  Bitcoin,
  DollarSign,
  BarChart3,
  Gem,
  UserPlus,
  Wallet,
  Rocket,
  ShieldCheck,
  BookOpenCheck,
  Radio,
} from "lucide-react";
import {
  Container,
  Eyebrow,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import PostCover from "@/components/blog/PostCover";
import Reveal from "@/components/Reveal";
import { getLivePosts } from "@/lib/posts";
import { categoryName } from "@/lib/blog";
import { testimonials } from "@/lib/testimonials";
import { buildMetadata } from "@/lib/seo";
import { openEvents, registrationOpen } from "@/lib/registration";

const kpis = [
  { value: "4,000+", label: "Students helped" },
  { value: "2,000+", label: "Followers online" },
  { value: "58%", label: "Win rate" },
];

const markets = [
  "Forex",
  "Gold",
  "Crypto",
  "Stocks",
  "Commodities",
  "Indices",
  "Risk management",
  "Market psychology",
  "Technical analysis",
];

const expertise = [
  {
    n: "01",
    icon: Bitcoin,
    title: "Crypto Currency",
    points: ["Market cycles", "Spot vs derivatives", "Volatility control"],
  },
  {
    n: "02",
    icon: DollarSign,
    title: "Forex Trading",
    points: ["Major & minor pairs", "Trading sessions", "News events"],
  },
  {
    n: "03",
    icon: BarChart3,
    title: "Stocks Trading",
    points: ["Reading earnings", "Sector trends", "Long-term positioning"],
  },
  {
    n: "04",
    icon: Gem,
    title: "Commodities",
    points: ["Gold (XAU/USD)", "Oil & energy", "Safe-haven flows"],
  },
];

const pillars = [
  {
    n: "01.",
    icon: GraduationCap,
    title: "Education",
    desc: "Technical analysis, risk management and trading psychology, written for people who want to understand the market, not chase calls.",
    href: "/blog",
  },
  {
    n: "02.",
    icon: CalendarDays,
    title: "Live seminars",
    desc: "Free conferences and online sessions where you watch real analysis, ask questions and meet other traders.",
    href: "/events",
  },
  {
    n: "03.",
    icon: Users,
    title: "Community",
    desc: "A free trader community where questions get answered, not ignored.",
    href: "/join",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Join the community",
    desc: "Sign up free and get access to seminars, education drops and the trader group.",
    href: "/join",
  },
  {
    icon: Wallet,
    title: "Open an HFM account",
    desc: "Set up with the broker I trade and teach through. Start on demo if you're new.",
    href: "/open-account",
  },
  {
    icon: Rocket,
    title: "Start trading",
    desc: "Apply what you learn with a plan and a risk limit, starting on a demo account.",
    href: "/blog",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Risk first",
    desc: "Every lesson starts with where you're wrong and how much you can lose.",
  },
  {
    icon: BookOpenCheck,
    title: "Explained, not just called",
    desc: "You learn the why behind each setup so you can eventually trade without us.",
  },
  {
    icon: Radio,
    title: "Live sessions",
    desc: "Watch real analysis happen in real time at seminars and live trading sessions.",
  },
];



export const metadata = buildMetadata({
  title: { absolute: "Scout FX | Trading Education & Community" },
  description: "Structured trading education, free seminars and an active trader community, built for traders in Ghana and beyond.",
  path: "/",
  shareTitle: "Scout FX: trade smarter with real education",
});

export default async function Home() {
  const latest = (await getLivePosts()).slice(0, 3);
  // Top badge: the Seed Program while it's open, otherwise the next open event.
  const seedOpen = await registrationOpen("seed");
  const nextEvent = (await openEvents())[0];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 overflow-hidden pb-24 pt-40">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="spotlight pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 animate-pulse-glow rounded-full bg-brand-500/10 blur-[120px]" />

        <Container className="relative flex flex-col items-center text-center">
          {(seedOpen || nextEvent) && (
            <div className="animate-fade-up">
              <Link href={seedOpen ? "/seed-program" : `/events/${nextEvent.id}`}>
                <Eyebrow>
                  <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black">New</span>
                  {seedOpen
                    ? "Seed Program: free training + a shot at $50 seed capital"
                    : `${nextEvent.free ? "Free: " : ""}${nextEvent.title} · ${nextEvent.date.split(" · ")[0]}`}
                  <ArrowRight className="h-3 w-3" />
                </Eyebrow>
              </Link>
            </div>
          )}

          <h1
            className="mt-7 max-w-4xl animate-fade-up text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-gradient">Trade smarter with </span>
            <span className="text-brand-500">real education</span>
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-zinc-400 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Structured trading education, free seminars and an active
            community, built for traders in Ghana and beyond.
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <PrimaryButton href="/join">
              Get started <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton href="/events">Upcoming events</SecondaryButton>
          </div>

          <div
            className="mt-12 grid w-full max-w-3xl animate-fade-up grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10"
            style={{ animationDelay: "320ms" }}
          >
            {kpis.map((k) => (
              <div key={k.label} className="bg-black/80 px-4 py-5 backdrop-blur">
                <p className="text-2xl font-bold text-white sm:text-3xl">{k.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{k.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* MARKETS MARQUEE */}
      <section className="border-y border-white/10 bg-white/[0.02] py-5">
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...markets, ...markets].map((m, i) => (
              <span
                key={i}
                className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-zinc-500"
              >
                {m}
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISE GRID */}
      <section className="py-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="sm:col-span-2 lg:col-span-1">
              <div className="card relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden p-7">
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  What we cover
                </p>
                <h2 className="text-gradient text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                  Expertise
                </h2>
              </div>
            </Reveal>

            {expertise.map((e, i) => (
              <Reveal key={e.n} delay={(i + 1) * 80}>
                <div className="card card-hover group relative h-full overflow-hidden p-7">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                      {e.title}
                    </h3>
                    <e.icon className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-brand-500" />
                  </div>
                  <div className="mt-8 flex items-end gap-6 border-t border-white/10 pt-6">
                    <span className="text-5xl font-light tabular-nums text-white transition-colors group-hover:text-brand-500">
                      {e.n}
                    </span>
                    <ul className="space-y-1.5 pb-1">
                      {e.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="text-brand-500">✦</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={400}>
              <Link
                href="/blog"
                className="group flex h-full min-h-[200px] flex-col justify-between rounded-2xl bg-brand-600 p-7 text-black transition-all hover:shadow-glow"
              >
                <p className="text-xs font-bold uppercase tracking-widest">Start here</p>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-2xl font-bold leading-tight">
                    Learn the basics, free.
                  </p>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-brand-500 transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* PILLARS: middle card highlighted */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="text-white">Your </span>
              <span className="text-brand-500">trusted</span>
              <span className="text-zinc-500"> partner in the markets.</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Not three separate products, one path. Learn the fundamentals,
              see them applied live, and keep learning with other traders.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-4 md:grid-cols-3 md:gap-0">
            {pillars.map((p, i) => {
              const hot = i === 1;
              return (
                <Reveal key={p.title} delay={i * 100}>
                  <Link
                    href={p.href}
                    className={`group relative flex flex-col p-8 transition-all ${
                      hot
                        ? "z-10 rounded-2xl bg-brand-600 text-black md:-my-6 md:py-14 md:shadow-glow"
                        : `card rounded-2xl md:rounded-none ${i === 0 ? "md:rounded-l-2xl md:border-r-0" : "md:rounded-r-2xl md:border-l-0"}`
                    }`}
                  >
                    <span className={`text-lg font-bold ${hot ? "" : "text-brand-500"}`}>{p.n}</span>
                    <p.icon className={`mt-6 h-6 w-6 ${hot ? "" : "text-zinc-500"}`} />
                    <h3 className={`mt-3 text-xl font-bold ${hot ? "" : "text-white"}`}>{p.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${hot ? "text-black/80" : "text-zinc-400"}`}>
                      {p.desc}
                    </p>
                    <span className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${hot ? "" : "text-white"}`}>
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* HOW TO START */}
      <section className="py-24">
        <Container>
          <SectionHeading
            title={
              <>
                Start your <span className="text-brand-500">trading</span> journey
              </>
            }
            subtitle="Three steps from curious to confident. Education is free; the account is only needed when you're ready to trade."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => {
              const hot = i === 1;
              return (
                <Reveal key={s.title} delay={i * 100}>
                  <Link
                    href={s.href}
                    className={`group flex h-full flex-col items-center rounded-2xl p-8 text-center transition-all ${
                      hot ? "bg-brand-600 text-black hover:shadow-glow" : "card card-hover"
                    }`}
                  >
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                        hot ? "border-black bg-black text-brand-500" : "border-brand-500 bg-brand-500 text-black"
                      }`}
                    >
                      <s.icon className="h-7 w-7" />
                    </span>
                    <span className={`mt-5 text-xs font-bold uppercase tracking-widest ${hot ? "text-black/60" : "text-zinc-500"}`}>
                      Step {i + 1}
                    </span>
                    <h3 className={`mt-1 text-lg font-bold ${hot ? "" : "text-white"}`}>{s.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${hot ? "text-black/80" : "text-zinc-400"}`}>{s.desc}</p>
                    <span
                      className={`mt-6 inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-semibold ${
                        hot ? "bg-black text-brand-500" : "text-white"
                      }`}
                    >
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* WHY SCOUT FX */}
      <section className="py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <Reveal>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="text-white">What we </span>
              <span className="text-brand-500">provide</span>
              <span className="text-zinc-500"> for you.</span>
            </h2>
            <p className="mt-5 max-w-md border-l-2 border-brand-500 pl-4 text-sm leading-relaxed text-zinc-400">
              We scout opportunities and make trading easier, by teaching the
              method behind every decision, not just handing out calls.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="card card-hover h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-black">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-sm font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* BLOG PREVIEW (hidden until the first post is published) */}
      {latest.length > 0 && (
      <section className="py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading center={false} eyebrow="Blog" title="Latest from the blog" />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-brand-500"
            >
              See all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {latest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 100}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="card card-hover group flex h-full flex-col overflow-hidden"
                >
                  <PostCover seed={a.slug} category={a.category} image={a.cover} className="aspect-[16/10]" />
                  <div className="p-5">
                    <span className="text-xs font-semibold text-brand-500">{categoryName(a.category)}</span>
                    <h3 className="mt-2 text-base font-bold leading-snug text-white">{a.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      )}

      {/* UPCOMING EVENT */}
      {nextEvent && (
        <section className="py-12">
          <Container>
            <Reveal>
              <div className="card relative flex flex-col items-center gap-6 overflow-hidden p-8 sm:flex-row sm:justify-between">
                <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-black">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                      {nextEvent.free ? "Free upcoming event" : "Upcoming event"}
                    </p>
                    <h3 className="text-lg font-bold text-white">{nextEvent.title}</h3>
                    <p className="text-sm text-zinc-400">
                      {nextEvent.date} · {nextEvent.location}
                    </p>
                  </div>
                </div>
                <PrimaryButton href={`/events/${nextEvent.id}`} className="relative w-full sm:w-auto">
                  Reserve a spot
                </PrimaryButton>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* TESTIMONIALS (hidden while there are none) */}
      {testimonials.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading
              title="Beyond expectations"
              subtitle="What traders in the community say about learning with Scout FX."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 100}>
                  <figure className="card h-full p-7">
                    <blockquote className="text-sm leading-relaxed text-zinc-300">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-black">
                        {t.name[0]}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{t.name}</span>
                        <span className="block text-xs text-zinc-500">{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FINAL CTA: horizon arc */}
      <section className="relative overflow-hidden pb-8 pt-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 px-6 pb-16 pt-28 text-center">
              <div className="pointer-events-none absolute left-1/2 top-10 h-[900px] w-[900px] -translate-x-1/2 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent" />
              <div className="pointer-events-none absolute left-1/2 top-10 h-40 w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-brand-500/25 blur-3xl" />
              {[18, 36, 64, 82].map((l, i) => (
                <span
                  key={l}
                  className="pointer-events-none absolute h-1 w-1 animate-pulse-glow rounded-full bg-white"
                  style={{ left: `${l}%`, top: `${i % 2 ? 22 : 34}%`, animationDelay: `${i * 0.7}s` }}
                />
              ))}
              <div className="relative">
                <h2 className="text-gradient text-4xl font-bold uppercase tracking-tight sm:text-6xl">
                  Ready to trade?
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400 sm:text-base">
                  Put the education to work with HFM, the broker I trade and
                  teach through.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <PrimaryButton href="/open-account">
                    Open HFM account <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>
                  <SecondaryButton href="/join">Join free first</SecondaryButton>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
