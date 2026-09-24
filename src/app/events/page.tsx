import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { upcomingEvents, pastEvents } from "@/lib/events";

export default function EventsPage() {
  return (
    <section className="py-16">
      <Container>
        <Eyebrow>Events</Eyebrow>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          Seminars &amp; workshops
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
          In-person and online sessions on trading fundamentals, risk
          management and strategy, free to attend.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {upcomingEvents.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="rounded-2xl border border-ink-100 bg-white p-6 transition-shadow hover:shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                <CalendarDays className="h-5 w-5 text-ink-900" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-900">{e.title}</h3>
                {e.free && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-900">
                    Free
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <CalendarDays className="h-3.5 w-3.5" /> {e.date}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <MapPin className="h-3.5 w-3.5" /> {e.location}
              </p>
              {typeof e.spotsLeft === "number" && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-ink-900">
                  <Users className="h-3.5 w-3.5" /> {e.spotsLeft} spots left
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Past events
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {pastEvents.map((e) => (
              <div key={e.title} className="flex items-center justify-between rounded-2xl border border-ink-100 bg-ink-100/20 p-5">
                <div>
                  <p className="text-sm font-bold text-ink-900">{e.title}</p>
                  <p className="text-xs text-ink-500">{e.date}</p>
                </div>
                <p className="text-xs font-semibold text-ink-500">
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
