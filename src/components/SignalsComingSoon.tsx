import { Container, Eyebrow, PrimaryButton, SecondaryButton } from "@/components/ui";

/** Shown at /signals until signals launch (see SIGNALS_LIVE in src/lib/features.ts). */
export default function SignalsComingSoon() {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <Eyebrow>Signals</Eyebrow>
        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-gradient pb-1 sm:text-5xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-400">
          We&apos;re building a fully logged, public track record before we
          share any signals. In the meantime, learn the fundamentals for free
          and join a live session.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PrimaryButton href="/blog">Start learning</PrimaryButton>
          <SecondaryButton href="/events">Upcoming events</SecondaryButton>
        </div>
      </Container>
    </section>
  );
}
