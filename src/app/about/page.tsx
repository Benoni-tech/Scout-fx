import { Container, Eyebrow, SecondaryButton } from "@/components/ui";
import { ShieldCheck, GraduationCap, Users } from "lucide-react";

const values = [
  {
    icon: GraduationCap,
    title: "Education first",
    body: "Every piece of content explains the why behind a setup, not just the call: technical analysis, risk management and trading psychology.",
  },
  {
    icon: ShieldCheck,
    title: "No hype",
    body: "No guaranteed returns, no get-rich-quick messaging. Trading carries real risk, and we say so plainly.",
  },
  {
    icon: Users,
    title: "Community-led",
    body: "Built with and for Ghanaian traders: seminars, workshops and an active community, not a one-way broadcast.",
  },
];

export default function AboutPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          Scout Cartel
        </h1>
        <p className="mt-2 text-base font-semibold text-brand-600">
          Trader · Educator · Community Leader
        </p>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-500">
          Scout Cartel is a trading education brand teaching technical
          analysis, risk management and trading psychology to a Ghanaian
          audience across Forex, Gold and crypto markets. What started as a
          series of free seminars has grown into a community of thousands of
          traders and a rule-based signals track record published in the
          open.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
                <v.icon className="h-4 w-4 text-brand-600" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink-900">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-ink-100 bg-brand-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              Want the full media kit: stats, platforms and testimonials?
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Everything a partner or press contact needs in one place.
            </p>
          </div>
          <SecondaryButton href="/media-kit">View media kit</SecondaryButton>
        </div>
      </Container>
    </section>
  );
}
