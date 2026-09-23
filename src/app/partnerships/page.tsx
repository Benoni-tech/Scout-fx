import { Container, Eyebrow, StatCard, SecondaryButton } from "@/components/ui";
import { Users, TrendingUp, CalendarCheck, Handshake, Mic, Megaphone } from "lucide-react";

const stats = [
  { label: "Community members", value: "4,200+" },
  { label: "Avg. monthly registrations", value: "250" },
  { label: "Active traders / mo", value: "100" },
  { label: "Signal win rate", value: "58%" },
];

const opportunities = [
  {
    icon: Mic,
    title: "Seminars & workshops",
    body: "Co-host an in-person or online session for the community: trading, fintech or broker partners.",
  },
  {
    icon: Megaphone,
    title: "Content collaborations",
    body: "Sponsored education content, platform reviews or joint social campaigns across Instagram, TikTok and YouTube.",
  },
  {
    icon: Handshake,
    title: "Broker & affiliate deals",
    body: "Currently partnered with HFM. Open to conversations with other regulated brokers and trading-adjacent tools.",
  },
];

export default function PartnershipsPage() {
  return (
    <section className="py-16">
      <Container>
        <Eyebrow>Partnerships</Eyebrow>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          Work with Scout Cartel
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
          We partner with brokers, fintech products and events that align
          with responsible trading, reaching an engaged Ghanaian trading
          audience.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4 text-brand-600" />} iconBg="bg-brand-50" label={stats[0].label} value={stats[0].value} />
          <StatCard icon={<TrendingUp className="h-4 w-4 text-success" />} iconBg="bg-success/10" label={stats[1].label} value={stats[1].value} />
          <StatCard icon={<Users className="h-4 w-4 text-brand-600" />} iconBg="bg-brand-50" label={stats[2].label} value={stats[2].value} />
          <StatCard icon={<CalendarCheck className="h-4 w-4 text-success" />} iconBg="bg-success/10" label={stats[3].label} value={stats[3].value} />
        </div>

        <div className="mt-14">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Ways to collaborate
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {opportunities.map((o) => (
              <div key={o.title} className="rounded-2xl border border-ink-100 bg-white p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
                  <o.icon className="h-4 w-4 text-brand-600" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-ink-900">{o.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-brand-600 p-8 text-center">
          <h3 className="text-xl font-extrabold text-white">For partnership inquiries</h3>
          <p className="mt-1 text-sm text-brand-100">hello@scoutcartel.trade</p>
          <div className="mt-5 flex justify-center">
            <SecondaryButton href="/media-kit" className="bg-white">
              View media kit
            </SecondaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
