import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CandlestickChart,
  Check,
  ClipboardList,
  GraduationCap,
  Globe,
  HeartHandshake,
  LineChart,
  ShieldCheck,
  Sprout,
  Wallet,
  Brain,
} from "lucide-react";
import {
  Container,
  Eyebrow,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";
import SeedApplicationForm from "@/components/SeedApplicationForm";
import { SEED_PROGRAM, seedFaqs } from "@/lib/seedProgram";

export const metadata: Metadata = {
  title: `${SEED_PROGRAM.name} | Free trading training`,
  description: `Register for free trading training from Scout FX. Participants may also qualify for up to $${SEED_PROGRAM.seedAmount} seed capital, awarded at Scout FX's discretion.`,
};

const $ = `$${SEED_PROGRAM.seedAmount}`;

const steps = [
  { icon: ClipboardList, title: "Register", desc: "Fill in the short registration form below. It takes about three minutes." },
  { icon: GraduationCap, title: "Get trained", desc: "Every registered participant is guaranteed a place in the free training on the market, charts and risk." },
  { icon: Wallet, title: `Up to ${$} seed capital`, desc: "After training, Scout FX selects participants to receive seed capital based on attendance, assessment and conduct." },
  { icon: LineChart, title: "Trade live", desc: "Put what you learned into practice in the real market, with the community behind you." },
];

const topics = [
  { icon: Globe, title: "How the market works", points: ["Currency pairs & gold", "Trading sessions", "Brokers & spreads"] },
  { icon: CandlestickChart, title: "Reading a chart", points: ["Candlesticks", "Support & resistance", "Timeframes"] },
  { icon: ShieldCheck, title: "Risk management", points: ["Position sizing", "Stop-losses", "Protecting small accounts"] },
  { icon: Brain, title: "Trading psychology", points: ["Discipline", "Handling losses", "Avoiding overtrading"] },
  { icon: BookOpen, title: "Building a plan", points: ["Entry rules", "Trade journal", "Reviewing results"] },
];

const goodFit = [
  "You're new to trading and want to learn properly",
  "You can commit time to the training sessions",
  "You want to practise with real money, starting small",
  "You're ready to follow a plan and manage risk",
];

const beforeYouApply = [
  "You must be 18 or older",
  "You'll need to open a trading account in your own name",
  "Training is guaranteed; seed capital is not",
  "Trading is risky: you can lose the seed capital",
];

export default function SeedProgramPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 overflow-hidden pb-24 pt-36">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="spotlight pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[480px] w-[480px] -translate-x-1/2 animate-pulse-glow rounded-full bg-brand-500/10 blur-[120px]" />

        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="text-center lg:text-left">
            <div className="animate-fade-up">
              <Eyebrow>
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black">New</span>
                {SEED_PROGRAM.name}
              </Eyebrow>
            </div>
            <h1
              className="mt-7 animate-fade-up pb-1 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              <span className="text-gradient">Learn to trade. Start with </span>
              <span className="text-brand-500">{$}</span>
              <span className="text-gradient"> on us.</span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0"
              style={{ animationDelay: "160ms" }}
            >
              Register and you&apos;re guaranteed a place in our free training
              on the market, charts and risk. Standout participants may be
              awarded up to {$} seed capital to place their first real trades.
            </p>
            <div
              className="mt-9 flex animate-fade-up flex-col justify-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: "240ms" }}
            >
              <PrimaryButton href="#apply">
                Register free <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton href="#how-it-works">How it works</SecondaryButton>
            </div>
          </div>

          {/* seed account card */}
          <Reveal delay={200}>
            <div className="relative mx-auto max-w-sm">
              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-brand-500/15 blur-3xl" />
              <div className="relative animate-float rounded-[2rem] border border-white/10 bg-zinc-950/90 p-7 shadow-card backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-black">
                      <Sprout className="h-4 w-4" />
                    </span>
                    Seed account
                  </span>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-500">
                    Up to {$}
                  </span>
                </div>
                <p className="mt-8 text-xs uppercase tracking-widest text-zinc-500">Starting balance</p>
                <p className="mt-1 text-6xl font-bold tabular-nums tracking-tight text-white">
                  {$}<span className="text-2xl text-zinc-500">.00</span>
                </p>
                <svg viewBox="0 0 300 90" className="mt-6 w-full overflow-visible">
                  <defs>
                    <linearGradient id="seed-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FBFE00" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FBFE00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,70 C30,66 45,50 75,55 S120,30 150,38 S210,15 240,22 S280,8 300,6 L300,90 L0,90 Z" fill="url(#seed-fill)" />
                  <path
                    d="M0,70 C30,66 45,50 75,55 S120,30 150,38 S210,15 240,22 S280,8 300,6"
                    fill="none"
                    stroke="#FBFE00"
                    strokeWidth="2.5"
                    strokeDasharray="1000"
                    className="animate-draw"
                  />
                  <circle cx="300" cy="6" r="4" fill="#FBFE00" className="animate-pulse-glow" />
                </svg>
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
                  {[
                    ["Training", "Free"],
                    ["Seed", `≤ ${$}`],
                    ["Age", "18+"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">{k}</p>
                      <p className="mt-1 text-sm font-bold text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="relative mt-4 text-center text-[11px] text-zinc-600">
                Illustration only. Seed capital is awarded at Scout FX&apos;s discretion and is not guaranteed.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-28 py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="text-white">From </span>
              <span className="text-brand-500">zero</span>
              <span className="text-zinc-500"> to your first live trade.</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Training is guaranteed for everyone who registers. Seed capital
              is earned, not automatic, so it goes into trades you understand.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const hot = i === 2;
              return (
                <Reveal key={s.title} delay={i * 100}>
                  <div
                    className={`group relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 ${
                      hot ? "bg-brand-600 text-black hover:shadow-glow" : "card card-hover"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          hot ? "bg-black text-brand-500" : "bg-white/5 text-zinc-400 transition-colors group-hover:bg-brand-500 group-hover:text-black"
                        }`}
                      >
                        <s.icon className="h-5 w-5" />
                      </span>
                      <span className={`text-5xl font-light tabular-nums ${hot ? "text-black/80" : "text-white/15 transition-colors group-hover:text-brand-500"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className={`mt-8 text-xl font-bold ${hot ? "" : "text-white"}`}>{s.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${hot ? "text-black/80" : "text-zinc-400"}`}>{s.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="py-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="sm:col-span-2 lg:col-span-1">
              <div className="card relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden p-7">
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">The training</p>
                <h2 className="text-gradient text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
                  What you&apos;ll learn
                </h2>
              </div>
            </Reveal>
            {topics.map((t, i) => (
              <Reveal key={t.title} delay={(i + 1) * 80}>
                <div className="card card-hover group h-full p-7">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t.title}</h3>
                    <t.icon className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-brand-500" />
                  </div>
                  <ul className="mt-8 space-y-2 border-t border-white/10 pt-6">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-zinc-400">
                        <span className="text-brand-500">✦</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24">
        <Container>
          <SectionHeading
            title={
              <>
                Is this <span className="text-brand-500">for you?</span>
              </>
            }
            subtitle="The program is built for motivated beginners. Here's what to know before you apply."
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
            <Reveal>
              <div className="card h-full p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-black">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">A great fit if</h3>
                <ul className="mt-5 space-y-3">
                  {goodFit.map((g) => (
                    <li key={g} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card h-full p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">Before you apply</h3>
                <ul className="mt-5 space-y-3">
                  {beforeYouApply.map((g) => (
                    <li key={g} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* APPLY */}
      <section id="apply" className="scroll-mt-28 py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
              <div className="bg-grid pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[640px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-brand-500/25 blur-3xl" />

              <div className="relative px-3 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-20">
                <div className="mx-auto max-w-2xl text-center">
                  <Eyebrow>
                    <Sprout className="h-3.5 w-3.5 text-brand-500" />
                    Registration open
                  </Eyebrow>
                  <h2 className="text-gradient mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                    Register for the Seed Program
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
                    Registration is free, takes about three minutes and
                    guarantees your place in the training.
                  </p>
                </div>

                <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-black/60 p-4 shadow-card backdrop-blur sm:mt-12 sm:p-10">
                  <SeedApplicationForm />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="text-brand-500">answered</span>
              </>
            }
          />
          <Reveal className="mt-12">
            <Faq items={seedFaqs} />
          </Reveal>
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-zinc-600">
            The {SEED_PROGRAM.name} is an educational program. Registration
            guarantees a place in the training only. Seed capital of up to{" "}
            {$} is awarded at Scout FX&apos;s sole discretion, is not
            guaranteed, is for trading only and can be lost. Nothing on this page is financial
            advice. See our{" "}
            <Link href="/legal/risk-disclosure" className="underline hover:text-zinc-400">
              risk disclosure
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
