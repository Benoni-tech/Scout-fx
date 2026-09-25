import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { Container, SecondaryButton } from "@/components/ui";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getEventById } from "@/lib/events";
import { normalizeTicketCode } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your ticket | Scout FX",
  robots: { index: false, follow: false },
};

function Field({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-snug text-white">{value}</p>
    </div>
  );
}

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
  const [day, time] = (event?.date ?? "").split(" · ");
  const yearMatch = (event?.title ?? "Event").match(/^(.*?)(\s\d{4})$/);

  return (
    <section className="relative py-12">
      <Container className="max-w-md">
        <div className="animate-fade-up">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-card">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(251,254,0,0.2),transparent)]" />

            {/* header */}
            <div className="relative flex items-center justify-between px-7 pt-7">
              <span className="flex items-center gap-2">
                <Image src="/logo.png" alt="" width={20} height={22} className="h-5 w-auto" />
                <span className="text-sm font-extrabold uppercase tracking-tight text-white">Scout FX</span>
              </span>
              <span className="rounded-full bg-brand-500 px-3 py-1 text-[10px] font-extrabold tracking-[0.2em] text-black">
                ADMIT ONE
              </span>
            </div>

            {/* title + details */}
            <div className="relative px-7 pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-500">
                {event?.free ? "Free entry ticket" : "Entry ticket"}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-[1.05] tracking-tight text-white">
                {yearMatch ? yearMatch[1] : (event?.title ?? "Event")}
                {yearMatch && <span className="text-brand-500">{yearMatch[2]}</span>}
              </h1>

              {event && (
                <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5">
                  <Field label="Date" value={day} className="col-span-2" />
                  <Field label="Time" value={time || "-"} />
                  <Field label="Venue" value={event.location} />
                  <Field label="Attendee" value={rsvp.name} className="col-span-2" />
                </div>
              )}
            </div>

            {/* perforation */}
            <div className="relative my-7 flex items-center">
              <span className="absolute -left-4 h-8 w-8 rounded-full border border-white/10 bg-black" />
              <span className="mx-6 flex-1 border-t-2 border-dashed border-white/15" />
              <span className="absolute -right-4 h-8 w-8 rounded-full border border-white/10 bg-black" />
            </div>

            {/* QR stub */}
            <div className="flex flex-col items-center px-7 pb-8 text-center">
              <div className="rounded-3xl bg-brand-500 p-3 shadow-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/tickets/${code}/qr`} alt="Ticket QR code" width={220} height={220} className="rounded-xl" />
              </div>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">Ticket code</p>
              <p className="mt-1 font-mono text-2xl font-extrabold tracking-[0.25em] text-white">{code}</p>

              {rsvp.attended ? (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Checked in
                </p>
              ) : (
                <p className="mt-3 text-xs text-zinc-400">Show this at the gate · valid for one entry</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "120ms" }}>
          <a
            href={`/api/tickets/${code}/image?download=1`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-700 hover:shadow-glow"
          >
            <Download className="h-4 w-4" /> Save ticket
          </a>
          {event && (
            <SecondaryButton href={`/events/${event.id}`} className="flex-1">
              <ArrowLeft className="h-4 w-4" /> Event details
            </SecondaryButton>
          )}
        </div>

        <p className="mt-6 text-center text-sm leading-relaxed text-zinc-500">
          Save the ticket in case you don&apos;t have signal on the day.
          Admits one person, once.
        </p>
      </Container>
    </section>
  );
}
