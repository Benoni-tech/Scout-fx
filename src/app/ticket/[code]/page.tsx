import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getEventById } from "@/lib/events";
import { normalizeTicketCode } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your ticket | Scout FX",
  robots: { index: false, follow: false },
};

export default async function TicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = normalizeTicketCode((await params).code);
  if (!code) notFound();

  const doc = await getAdminDb().collection("rsvps").doc(code).get();
  if (!doc.exists) notFound();

  const rsvp = doc.data()!;
  const event = getEventById(rsvp.eventId);

  return (
    <section className="py-12">
      <Container className="max-w-sm">
        <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
          <div className="bg-brand-600 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-900">
              Your ticket
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-ink-900">
              {event?.title ?? "Event"}
            </h1>
          </div>

          <div className="px-6 py-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/tickets/${code}/qr`}
              alt="Ticket QR code"
              width={240}
              height={240}
              className="mx-auto rounded-xl border border-ink-100"
            />
            <p className="mt-3 text-xs text-ink-500">Ticket code</p>
            <p className="font-mono text-xl font-extrabold tracking-[0.15em] text-ink-900">
              {code}
            </p>
            <p className="mt-4 text-lg font-bold text-ink-900">{rsvp.name}</p>

            {rsvp.attended && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" /> Checked in
              </p>
            )}
          </div>

          {event && (
            <div className="space-y-2 border-t border-dashed border-ink-100 px-6 py-5 text-sm text-ink-700">
              <p className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-ink-900" />
                {event.date}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-900" />
                {event.location}
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm leading-relaxed text-ink-500">
          Show this QR code at the gate. Screenshot it in case you don&apos;t
          have signal on the day. Admits one person, once.
        </p>
      </Container>
    </section>
  );
}
