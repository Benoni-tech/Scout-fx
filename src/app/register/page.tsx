import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Container, PrimaryButton, SecondaryButton } from "@/components/ui";
import { openEvents } from "@/lib/registration";
import { buildMetadata } from "@/lib/seo";

// One link for bios, ads and WhatsApp: /register always goes to the next event
// that's open for registration, keeping any utm_/ref tags on the way.

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Register for our next event",
  description: "Register free for the next Scout FX event and get your ticket by email.",
  path: "/register",
});

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = (await openEvents())[0];
  if (next) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(await searchParams)) {
      if (typeof v === "string") query.set(k, v);
    }
    const qs = query.toString();
    redirect(`/events/${next.id}${qs ? `?${qs}` : ""}`);
  }

  return (
    <section className="bg-grid py-24">
      <Container className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10">
          <CalendarDays className="h-6 w-6 text-brand-500" />
        </div>
        <h1 className="mx-auto mt-5 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-gradient pb-1 sm:text-5xl">
          No event open right now
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-400">
          Join the free community and you&apos;ll be the first to hear when registration for the next one opens.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PrimaryButton href="/join">Join the community</PrimaryButton>
          <SecondaryButton href="/events">See events</SecondaryButton>
        </div>
      </Container>
    </section>
  );
}
