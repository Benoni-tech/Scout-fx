import { Container, Eyebrow, SecondaryButton } from "@/components/ui";
import { ShieldCheck, GraduationCap, Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

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

export const metadata = buildMetadata({
  title: "About",
  description: "Scout FX is a trading education brand teaching technical analysis, risk management and trading psychology to traders in Ghana.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
          Scout FX
        </h1>
        <p className="mt-2 text-base font-semibold text-brand-500">
          Trader · Educator · Community Leader
        </p>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
          Scout FX is a trading education brand teaching technical
          analysis, risk management and trading psychology to a Ghanaian
          audience across Forex, Gold and crypto markets. What started as a
          series of free seminars has grown into a community of thousands of
          traders and a rule-based signals track record published in the
          open.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10">
                <v.icon className="h-4 w-4 text-white" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-brand-500/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Want the full media kit: stats, platforms and testimonials?
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Everything a partner or press contact needs in one place.
            </p>
          </div>
          <SecondaryButton href="/media-kit">View media kit</SecondaryButton>
        </div>
      </Container>
    </section>
  );
}
