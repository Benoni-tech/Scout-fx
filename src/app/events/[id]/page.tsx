import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Container,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import RsvpForm from "@/components/RsvpForm";
import Countdown from "@/components/Countdown";
import HeroSlides from "@/components/HeroSlides";
import PhotoHero from "@/components/PhotoHero";
import SpeakersGrid from "@/components/SpeakersGrid";
import TestimonialSlider from "@/components/TestimonialSlider";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import EventPixel from "@/components/EventPixel";
import { buildMetadata, eventCity, eventTime, shortEventDate } from "@/lib/seo";
import { openEvents, registrationOpen } from "@/lib/registration";
import { eventStats } from "@/lib/eventStats";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
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
import { upcomingEvents, getEventById, eventIsOver, type EventItem } from "@/lib/events";
import { testimonials } from "@/lib/testimonials";

const LESSON_ICONS = [Globe, Clock, LineChart, ShieldCheck, Newspaper, Radio];

export function generateStaticParams() {
  return upcomingEvents.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const event = getEventById((await params).id);
  if (!event) return {};
  if (event.report && eventIsOver(event)) {
    return buildMetadata({
      title: `${event.title}: event report`,
      path: `/events/${event.id}`,
      image: event.report.gallery[0]?.src,
      description: event.report.summary[0],
    });
  }
  const when = `${shortEventDate(event)}, ${eventTime(event)}`;
  const title = `${event.free ? "Free " : ""}${event.title} · ${eventCity(event)}, ${shortEventDate(event)}`;
  // First sentence of the description: what it covers. Then the practical details.
  const about = event.description.split(/(?<=\.)\s/)[0];
  return buildMetadata({
    title,
    path: `/events/${event.id}`,
    image: `/events/${event.id}/opengraph-image`,
    description: `${when} at ${event.location}. ${about}${event.free ? " Free to attend, register for your ticket." : ""}`,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) notFound();
  const open = await registrationOpen(`event:${event.id}`);

  const whatsappLink = `https://wa.me/${event.contactPhone.replace(/[^0-9]/g, "")}`;
  if (event.report && eventIsOver(event)) return <EventReport event={event} />;

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
      <EventPixel eventId={event.id} eventName={event.title} />

      {/* HERO */}
      {event.hero ? (
        <PhotoHero
          images={event.hero.images}
          firstLine={titleMain.split(" ").slice(0, -1).join(" ")}
          lastLine={titleMain.split(" ").slice(-1)[0]}
          accent={titleYear}
          back={{ href: "/events", label: "Back to events" }}
          caption={event.hero.caption}
          cta={{ href: "#register", label: open ? (event.free ? "Register free" : "Register") : "Registration closed" }}
          facts={[
            { label: "Date & time", value: event.date },
            { label: "Venue", value: event.location },
            event.dateISO
              ? { label: "Starts in", value: <Countdown targetISO={event.dateISO} inline /> }
              : { label: "Entry", value: event.free ? "Free" : "Paid" },
          ]}
        />
      ) : (
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
      )}

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
                {event.agendaIntro ?? "What we’ll cover on the day."}
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
                event.speakers.length === 1 ? (
                  <>
                    Your <span className="text-brand-500">host</span>
                  </>
                ) : (
                  <>
                    Hosts &amp; <span className="text-brand-500">speakers</span>
                  </>
                )
              }
              subtitle={event.speakers.length === 1 ? "Tap the photo to read the bio." : "Tap a speaker to read their bio."}
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
      {event.signup ? (
        <SignupPanel event={event} open={open} whatsappLink={whatsappLink} />
      ) : (
      <section id="register" className="scroll-mt-28 py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
              <div className="bg-grid pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[640px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-brand-500/25 blur-3xl" />

              <div className="relative px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-gradient text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                    {open ? `Register for ${event.title}` : "Registration has closed"}
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
                    {open
                      ? "Seats fill up fast for free, in-person sessions. Register now and your ticket lands straight in your inbox."
                      : "Registration for this event is closed. If you registered, your ticket is in your email. Questions? Message us on WhatsApp."}
                  </p>
                </div>

                {open && (
                  <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/10 bg-black/60 p-6 shadow-card backdrop-blur sm:p-10">
                    <RsvpForm eventId={event.id} eventName={event.title} />
                  </div>
                )}

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

                <p className="mx-auto mt-6 max-w-5xl text-center text-xs leading-relaxed text-zinc-600">
                  This page uses the Meta Pixel to measure our Facebook ads.
                  See our{" "}
                  <Link href="/legal/privacy" className="underline hover:text-zinc-400">
                    privacy policy
                  </Link>{" "}
                  for details and how to opt out.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
      )}

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

/** Registration as a two-panel card: sliding event photos with a headline on the left, the form on the right. */
function SignupPanel({ event, open, whatsappLink }: { event: EventItem; open: boolean; whatsappLink: string }) {
  const signup = event.signup!;
  return (
    <section id="register" className="scroll-mt-28 py-24">
      <Container>
        <Reveal>
          <div className="grid gap-2 rounded-[2rem] border border-white/10 bg-zinc-950 p-2 lg:grid-cols-[1.05fr_1fr]">
            {/* photos */}
            <div className="relative isolate flex min-h-[380px] flex-col overflow-hidden rounded-[1.6rem] lg:min-h-[640px]">
              <HeroSlides images={signup.images} variant="panel" />
              <div className="relative flex items-center justify-between gap-4 p-7 sm:p-10">
                <span className="flex items-center gap-2">
                  <Image src="/logo.png" alt="" width={22} height={25} className="h-6 w-auto" />
                  <span className="text-[15px] font-extrabold uppercase tracking-tight text-white">Scout FX</span>
                </span>
                <Link href="#lessons" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 transition-colors hover:text-white">
                  See the lessons <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="relative mt-auto p-7 pb-16 sm:p-10 sm:pb-20">
                <h2 className="max-w-md text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl">{signup.headline}</h2>
                {signup.text && <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">{signup.text}</p>}
              </div>
            </div>

            {/* form */}
            <div className="flex flex-col justify-center rounded-[1.6rem] bg-black px-6 py-10 sm:px-12 lg:py-12">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                {open ? "Reserve your seat" : "Registration has closed"}
              </h2>
              {!open && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Registration for this event is closed. If you registered, your ticket is in your email. Questions? Message us on WhatsApp.
                </p>
              )}

              {open && (
                <div className="mt-8">
                  <RsvpForm eventId={event.id} eventName={event.title} stacked />
                </div>
              )}

              <div className="mt-8 flex items-center gap-4 text-xs text-zinc-600">
                <span className="h-px flex-1 bg-white/10" />
                Prefer WhatsApp?
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <a
                href={whatsappLink}
                className="mt-4 flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                <MessageCircle className="h-4 w-4 text-brand-500" />
                Message us on {event.contactPhone}
              </a>

              <p className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <QrCode className="h-3.5 w-3.5 text-brand-500" /> QR ticket by email, works offline at the gate
              </p>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-600">
                This page uses the Meta Pixel to measure our Facebook ads. See our{" "}
                <Link href="/legal/privacy" className="underline hover:text-zinc-400">
                  privacy policy
                </Link>{" "}
                for details and how to opt out.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** What an event page becomes once the event is over: a short report with real numbers and photos. */
async function EventReport({ event }: { event: EventItem }) {
  const report = event.report!;
  const [stats, next] = await Promise.all([eventStats(event.id), openEvents().then((list) => list[0])]);
  const yearMatch = event.title.match(/^(.*?)(\s\d{4})$/);
  const titleMain = yearMatch ? yearMatch[1] : event.title;
  const lessons = event.agenda ?? [];
  const speakers = event.speakers ?? [];
  const day = event.date.split(" · ")[0];

  const numbers = [
    ...(stats ? [{ value: stats.registered.toLocaleString("en-GB"), label: "Registered" }] : []),
    ...(stats && stats.checkedIn > 0 ? [{ value: stats.checkedIn.toLocaleString("en-GB"), label: "Checked in at the gate" }] : []),
    ...(speakers.length ? [{ value: String(speakers.length), label: speakers.length === 1 ? "Speaker" : "Speakers" }] : []),
    ...(lessons.length ? [{ value: String(lessons.length), label: "Sessions" }] : []),
  ];

  return (
    <>
      <PhotoHero
        images={event.hero?.images ?? report.gallery}
        firstLine={titleMain.split(" ").slice(0, -1).join(" ")}
        lastLine={titleMain.split(" ").slice(-1)[0]}
        accent={yearMatch?.[2]}
        intro={<>Event report · {day} · {event.location}</>}
        back={{ href: "/events", label: "Back to events" }}
        cta={next ? { href: `/events/${next.id}`, label: "Register for the next one" } : { href: "/join", label: "Join the community" }}
        facts={[
          { label: "Date", value: day },
          { label: "Venue", value: event.location },
          ...(stats ? [{ label: "Registered", value: stats.registered.toLocaleString("en-GB") }] : []),
          ...(event.presentedBy ? [{ label: "Presented by", value: event.presentedBy }] : []),
        ]}
      />

      {/* the day in brief */}
      <section className="py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Event report</p>
              <h2 className="text-gradient mt-3 text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">The day in brief</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-300">
                {report.summary.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            {numbers.length > 0 && (
              <div className="grid grid-cols-2 gap-3 self-start">
                {numbers.map((n, i) => (
                  <div key={n.label} className={`rounded-2xl p-6 ${i === 0 ? "bg-brand-500 text-black" : "card"}`}>
                    <p className={`text-4xl font-extrabold tabular-nums sm:text-5xl ${i === 0 ? "" : "text-white"}`}>{n.value}</p>
                    <p className={`mt-2 text-xs font-semibold uppercase tracking-wider ${i === 0 ? "text-black/70" : "text-zinc-400"}`}>{n.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* what we covered */}
      {lessons.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading title={<>What we <span className="text-brand-500">covered</span></>} center={false} />
            <ol className="mt-10 grid gap-x-10 border-t border-white/10 sm:grid-cols-2">
              {lessons.map((l, i) => (
                <li key={l.title} className="flex gap-5 border-b border-white/10 py-6">
                  <span className="text-2xl font-light tabular-nums text-brand-500">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-bold text-white">{l.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">{l.blurb}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* gallery */}
      {report.gallery.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading title={<>On the <span className="text-brand-500">day</span></>} center={false} />
            {/* tiled grid: the first photo is a large feature tile, portrait photos span two rows */}
            <div className="mt-10 grid grid-flow-dense auto-rows-[240px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {report.gallery.map((img, i) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 ${
                    i === 0 ? "sm:col-span-2 lg:row-span-2" : img.tall ? "row-span-2" : ""
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    style={{ objectPosition: img.position ?? "center" }}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* who spoke */}
      {speakers.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading
              title={<>Who <span className="text-brand-500">spoke</span></>}
              subtitle={speakers.length === 1 ? "Tap the photo to read the bio." : "Tap a speaker to read their bio."}
            />
            <SpeakersGrid speakers={speakers} />
          </Container>
        </section>
      )}

      {/* next up */}
      <section className="py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
            {next ? (
              <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Next up</p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{next.title}</h2>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {next.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {next.location}</span>
                  </p>
                </div>
                <PrimaryButton href={`/events/${next.id}`}>
                  {next.free ? "Register free" : "Register"} <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
              </div>
            ) : (
              <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                  <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">Don&apos;t miss the next one</h2>
                  <p className="mt-3 text-sm text-zinc-400">Join the free community and hear first when registration opens.</p>
                </div>
                <PrimaryButton href="/join">Join the community</PrimaryButton>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
