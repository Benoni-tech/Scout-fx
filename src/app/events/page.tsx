import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { upcomingEvents, pastEvents } from "@/lib/events";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Seminars & workshops",
  description: "Free in-person and online sessions from Scout FX on trading fundamentals, risk management and strategy.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <section className="py-16">
      <Container>
        <Eyebrow>Events</Eyebrow>
        <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
          Seminars &amp; workshops
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
          In-person and online sessions on trading fundamentals, risk
          management and strategy, free to attend.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {upcomingEvents.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="card p-6 card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{e.title}</h3>
                {e.free && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                    Free
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                <CalendarDays className="h-3.5 w-3.5" /> {e.date}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                <MapPin className="h-3.5 w-3.5" /> {e.location}
              </p>
              {typeof e.spotsLeft === "number" && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Users className="h-3.5 w-3.5" /> {e.spotsLeft} spots left
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Past events
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {pastEvents.map((e) => (
              <div key={e.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div>
                  <p className="text-sm font-bold text-white">{e.title}</p>
                  <p className="text-xs text-zinc-400">{e.date}</p>
                </div>
                <p className="text-xs font-semibold text-zinc-400">
                  {e.attendees} attended
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
