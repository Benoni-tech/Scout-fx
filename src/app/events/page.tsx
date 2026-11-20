import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import PhotoHero from "@/components/PhotoHero";
import { eventIsOver, upcomingEvents as allEvents, type EventItem } from "@/lib/events";
import { eventStats } from "@/lib/eventStats";
import { openEvents } from "@/lib/registration";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Seminars & workshops",
  description: "Free in-person and online sessions from Scout FX on trading fundamentals, risk management and strategy.",
  path: "/events",
});

/** Photo card for an event: its first photo with the title and details over it. */
function EventCard({ event, label, meta }: { event: EventItem; label: string; meta?: string }) {
  const photo = event.hero?.images[0] ?? event.report?.gallery[0];
  return (
    <Link href={`/events/${event.id}`} className="group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
      {photo && (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: photo.position ?? "center" }}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-black/10" />
      <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-black transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="h-5 w-5" />
      </span>
      <p className="text-xs font-bold uppercase tracking-wider text-brand-500">{label}</p>
      <h3 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">{event.title}</h3>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-300">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" /> {event.date.split(" · ")[0]}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" /> {event.location}
        </span>
        {meta && (
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {meta}
          </span>
        )}
      </p>
    </Link>
  );
}

export default async function EventsPage() {
  // Events with closed registration drop off the upcoming list; finished ones with a report show under Past events.
  const upcomingEvents = await openEvents();
  const next = upcomingEvents[0];
  const reported = allEvents.filter((e) => e.report && eventIsOver(e));
  const reportStats = await Promise.all(reported.map((e) => eventStats(e.id)));
  const heroImages = reported[0]?.hero?.images ?? next?.hero?.images ?? [];

  return (
    <>
      {heroImages.length > 0 ? (
        <PhotoHero
          images={heroImages}
          firstLine="Seminars &"
          lastLine="workshops"
          intro="In-person and online sessions on trading fundamentals, risk management and strategy, free to attend."
          cta={next ? { href: `/events/${next.id}`, label: "Register for the next one" } : { href: "/join", label: "Join the community" }}
          facts={
            next
              ? [
                  { label: "Next event", value: next.title },
                  { label: "Date", value: next.date },
                  { label: "Venue", value: next.location },
                ]
              : []
          }
          caption={reported[0] ? `Photos from our ${reported[0].title}` : undefined}
        />
      ) : (
        <Container className="pt-16">
          <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-gradient pb-1 sm:text-5xl">Seminars &amp; workshops</h1>
        </Container>
      )}

      <section className="py-20">
        <Container>
          <h2 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl">Upcoming</h2>
          {upcomingEvents.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {upcomingEvents.map((e) => (
                <EventCard key={e.id} event={e} label={e.free ? "Free · Register now" : "Register now"} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-zinc-400">
              Nothing scheduled right now.{" "}
              <Link href="/join" className="font-semibold text-brand-500 hover:underline">
                Join the community
              </Link>{" "}
              to hear first when the next one opens.
            </p>
          )}

          {reported.length > 0 && (
            <h2 className="text-gradient mt-20 text-3xl font-bold tracking-tight sm:text-4xl">Past events</h2>
          )}
          {reported.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {reported.map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  label="Read the report"
                  meta={reportStats[i] ? `${reportStats[i]!.registered.toLocaleString("en-GB")} registered` : undefined}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
