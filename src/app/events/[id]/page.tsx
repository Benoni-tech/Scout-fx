import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Container,
  Eyebrow,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import RsvpForm from "@/components/RsvpForm";
import Countdown from "@/components/Countdown";
import SpeakersGrid from "@/components/SpeakersGrid";
import TestimonialSlider from "@/components/TestimonialSlider";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Ticket,
  Users,
  MessageCircle,
  Globe,
  Clock,
  LineChart,
  ShieldCheck,
  Newspaper,
  Radio,
  BookOpen,
  QrCode,
} from "lucide-react";
import { upcomingEvents, getEventById } from "@/lib/events";
import { testimonials } from "@/lib/testimonials";

const LESSON_ICONS = [Globe, Clock, LineChart, ShieldCheck, Newspaper, Radio];

export function generateStaticParams() {
  return upcomingEvents.map((e) => ({ id: e.id }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) notFound();

  const whatsappLink = `https://wa.me/${event.contactPhone.replace(/[^0-9]/g, "")}`;

  // "Forex Trading Conference 2026" -> highlight the trailing year in yellow
  const yearMatch = event.title.match(/^(.*?)(\s\d{4})$/);
  const titleMain = yearMatch ? yearMatch[1] : event.title;
  const titleYear = yearMatch ? yearMatch[2] : "";

  const detailCards = [
    { icon: CalendarDays, label: "Date & time", value: event.date },
    { icon: MapPin, label: "Location", value: event.location },
    {
      icon: Ticket,
      label: "Entry",
      value:
        (event.free ? "Free" : "Paid") +
        (typeof event.spotsLeft === "number" ? ` · ${event.spotsLeft} spots left` : ""),
    },
    ...(event.presentedBy
      ? [{ icon: Users, label: "Presented by", value: event.presentedBy }]
      : []),
  ];

  const lessons = event.agenda ?? [];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 overflow-hidden pb-24 pt-36">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="spotlight pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[480px] w-[480px] -translate-x-1/2 animate-pulse-glow rounded-full bg-brand-500/10 blur-[120px]" />

        <Container className="relative flex flex-col items-center text-center">
          <Link
            href="/events"
            className="mb-8 inline-flex items-center gap-1 self-start text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to events
          </Link>

          <div className="animate-fade-up">
            <Eyebrow>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-glow" />
              {event.free ? "Free to attend" : "Register now"}
              {event.presentedBy ? ` · ${event.presentedBy}` : ""}
            </Eyebrow>
          </div>

          <h1
            className="mt-7 max-w-4xl animate-fade-up pb-1 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-gradient">{titleMain}</span>
            {titleYear && <span className="text-brand-500">{titleYear}</span>}
          </h1>

          {event.theme && (
            <p
              className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-zinc-400 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Theme: <span className="font-semibold text-white">{event.theme}</span>
            </p>
          )}

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <PrimaryButton href="#register">
              {event.free ? "Register free" : "Register"} <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton href="#lessons">See the lessons</SecondaryButton>
          </div>

          {event.dateISO && (
            <div
              className="mt-12 w-full max-w-lg animate-fade-up"
              style={{ animationDelay: "320ms" }}
            >
              <Countdown targetISO={event.dateISO} />
            </div>
          )}
        </Container>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="py-24">
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal className="lg:row-span-2">
              <div className="card relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden p-8">
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  Event details
                </p>
                <div className="relative mt-10">
                  <h2 className="text-gradient text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
                    What to expect
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                    {event.description}
                  </p>
                </div>
              </div>
            </Reveal>

            {detailCards.map((d, i) => (
              <Reveal key={d.label} delay={(i + 1) * 80}>
                <div className="card card-hover group h-full p-7">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      {d.label}
                    </p>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-black">
                      <d.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-8 border-t border-white/10 pt-6 text-lg font-bold leading-snug text-white">
                    {d.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* LESSONS */}
      {lessons.length > 0 && (
        <section id="lessons" className="scroll-mt-28 py-24">
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                <span className="text-white">{lessons.length} lessons, </span>
                <span className="text-brand-500">one day</span>
                <span className="text-zinc-500"> of real trading.</span>
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                What we&apos;ll cover on the day, from the fundamentals of the
                market to a live trading session.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson, i) => {
                const Icon = LESSON_ICONS[i] ?? BookOpen;
                const hot = i === lessons.length - 1;
                return (
                  <Reveal key={lesson.title} delay={(i % 3) * 100}>
                    <div
                      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-all duration-300 ${
                        hot ? "bg-brand-600 text-black hover:shadow-glow" : "card card-hover"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            hot
                              ? "bg-black text-brand-500"
                              : "bg-white/5 text-zinc-400 transition-colors group-hover:bg-brand-500 group-hover:text-black"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span
                          className={`text-5xl font-light tabular-nums transition-colors ${
                            hot ? "text-black/80" : "text-white/15 group-hover:text-brand-500"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {hot && (
                        <span className="mt-6 w-fit rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-500">
                          Live
                        </span>
                      )}
                      <h3 className={`mt-6 text-lg font-bold leading-snug ${hot ? "" : "text-white"}`}>
                        {lesson.title}
                      </h3>
                      <p className={`mt-2 text-sm leading-relaxed ${hot ? "text-black/80" : "text-zinc-400"}`}>
                        {lesson.blurb}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* SPEAKERS */}
      {event.speakers && event.speakers.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading
              eyebrow="Who's speaking"
              title={
                <>
                  Hosts &amp; <span className="text-brand-500">speakers</span>
                </>
              }
              subtitle="Tap a speaker to read their bio."
            />
            <SpeakersGrid speakers={event.speakers} />
          </Container>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading
              title="Beyond expectations"
              subtitle="What traders who've learned with Scout FX say."
            />
            <Reveal className="mt-12">
              <TestimonialSlider items={testimonials} />
            </Reveal>
          </Container>
        </section>
      )}

      {/* REGISTER */}
      <section id="register" className="scroll-mt-28 py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
              <div className="bg-grid pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[640px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-brand-500/25 blur-3xl" />

              <div className="relative px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
                <div className="mx-auto max-w-2xl text-center">
                  <Eyebrow>
                    <Ticket className="h-3.5 w-3.5 text-brand-500" />
                    Reserve your spot
                  </Eyebrow>
                  <h2 className="text-gradient mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                    Register for {event.title}
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
                    Seats fill up fast for free, in-person sessions. Register
                    now and your ticket lands straight in your inbox.
                  </p>
                </div>

                <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/10 bg-black/60 p-6 shadow-card backdrop-blur sm:p-10">
                  <RsvpForm eventId={event.id} />
                </div>

                <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-400 sm:flex-row">
                  <span className="inline-flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-brand-500" />
                    QR ticket by email, works offline at the gate
                  </span>
                  <a
                    href={whatsappLink}
                    className="inline-flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-brand-500" />
                    Prefer WhatsApp?{" "}
                    <span className="font-semibold text-white">{event.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      {event.faqs && event.faqs.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading
              eyebrow="FAQ"
              title={
                <>
                  Questions, <span className="text-brand-500">answered</span>
                </>
              }
              subtitle="Everything you need to know before the day."
            />
            <Reveal className="mt-12">
              <Faq items={event.faqs} />
            </Reveal>
            <p className="mt-8 text-center text-sm text-zinc-500">
              Still unsure?{" "}
              <a href={whatsappLink} className="font-semibold text-white underline-offset-4 hover:text-brand-500 hover:underline">
                Message us on WhatsApp
              </a>
            </p>
          </Container>
        </section>
      )}
    </>
  );
}
