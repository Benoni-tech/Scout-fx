import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Eyebrow, SecondaryButton } from "@/components/ui";
import RsvpForm from "@/components/RsvpForm";
import Countdown from "@/components/Countdown";
import SpeakersGrid from "@/components/SpeakersGrid";
import {
  ArrowLeft,
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
} from "lucide-react";
import { upcomingEvents, getEventById } from "@/lib/events";

const LESSON_ICONS = [Globe, Clock, LineChart, ShieldCheck, Newspaper, Radio];

// Local, gold-accented stand-in for the shared (purple) SectionHeading,
// scoped to this page only.
function GoldSectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-800">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

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

  return (
    <>
      {/* HERO */}
      <section className="bg-grid relative overflow-hidden pb-20 pt-8">
        <Container className="flex flex-col items-center text-center">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-1 self-start text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to events
          </Link>

          <Eyebrow>
            <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
            {event.free ? "Free to attend" : "Register now"}
            {event.presentedBy ? ` · ${event.presentedBy}` : ""}
          </Eyebrow>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
            {event.title}
          </h1>

          {event.theme && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
              Theme: <span className="font-semibold text-ink-900">{event.theme}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#register"
              className="inline-flex items-center justify-center rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:bg-gold-700"
            >
              Register free
            </a>
            <SecondaryButton href="#lessons">See the lessons</SecondaryButton>
          </div>
        </Container>

        {event.dateISO && (
          <Container className="mt-14 max-w-lg">
            <Countdown targetISO={event.dateISO} />
          </Container>
        )}
      </section>

      {/* EVENT DETAILS */}
      <section className="py-20">
        <Container>
          <GoldSectionHeading
            eyebrow="Event details"
            title="What to expect"
            subtitle={event.description}
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {detailCards.map((d) => (
              <div
                key={d.label}
                className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100">
                  <d.icon className="h-4 w-4 text-ink-900" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">
                    {d.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink-900">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* LESSONS */}
      {event.agenda && event.agenda.length > 0 && (
        <section id="lessons" className="scroll-mt-28 border-t border-ink-100 bg-ink-100/20 py-20">
          <Container>
            <div className="mx-auto max-w-md text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-800">
                Curriculum
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Lessons
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                What we&apos;ll cover on the day, from the fundamentals to a
                live trading session.
              </p>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
              <div className="relative">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
                  <Image
                    src="/speakers/dr-newman.jpg"
                    alt="A trading session in progress"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {event.free && (
                  <div className="absolute -right-4 top-6 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gold-600 text-center text-ink-900 shadow-card">
                    <Ticket className="h-5 w-5" />
                    <span className="mt-1 text-xs font-bold leading-tight">
                      Free to
                      <br />
                      attend
                    </span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-ink-100">
                {event.agenda.map((lesson, i) => {
                  const Icon = LESSON_ICONS[i] ?? BookOpen;
                  return (
                    <div
                      key={lesson.title}
                      className="flex items-start gap-4 py-5 first:pt-0"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink-900">
                          {lesson.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-500">
                          {lesson.blurb}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* REGISTER */}
      <section id="register" className="scroll-mt-28 py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Reserve your spot</Eyebrow>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Register for {event.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500">
              Seats fill up fast for free, in-person sessions. Register now
              and we&apos;ll send the details straight to your email.
            </p>
            <a
              href={whatsappLink}
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 text-sm text-ink-700 transition-shadow hover:shadow-card"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-brand-800" />
              <span>
                Prefer WhatsApp? Contact{" "}
                <span className="font-semibold text-ink-900">
                  {event.contactPhone}
                </span>
              </span>
            </a>
          </div>

          <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-card">
            <RsvpForm eventId={event.id} />
          </div>
        </Container>
      </section>

      {/* SPEAKERS */}
      {event.speakers && event.speakers.length > 0 && (
        <section className="border-t border-ink-100 bg-ink-100/20 py-20">
          <Container>
            <GoldSectionHeading
              eyebrow="Who's speaking"
              title="Hosts & speakers"
              subtitle="Tap a speaker to read their bio."
            />
            <SpeakersGrid speakers={event.speakers} />
          </Container>
        </section>
      )}
    </>
  );
}
