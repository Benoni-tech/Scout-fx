import { testimonials } from "@/lib/testimonials";
import { Container, Eyebrow, StatCard, SecondaryButton } from "@/components/ui";
import { Users, TrendingUp, CalendarCheck, Download, Quote } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

const stats = [
  { label: "Community members", value: "4,200+" },
  { label: "Avg. monthly registrations", value: "250" },
  { label: "Active traders / mo", value: "100" },
  { label: "Signal win rate", value: "58%" },
];

const platforms = [
  { name: "Instagram", followers: "12.4K" },
  { name: "TikTok", followers: "9.1K" },
  { name: "YouTube", followers: "3.8K" },
  { name: "WhatsApp community", followers: "1.6K" },
];


export const metadata = buildMetadata({
  title: "Media kit",
  description: "Scout FX audience, channels and partnership details.",
  path: "/media-kit",
});

export default function MediaKitPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Eyebrow>Media kit</Eyebrow>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
              Scout FX
            </h1>
            <p className="mt-2 text-base font-semibold text-brand-500">
              Trader · Educator · Community Leader
            </p>
          </div>
          <SecondaryButton href="/media-kit">
            <Download className="mr-2 h-4 w-4" /> Download one-pager
          </SecondaryButton>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
          Scout FX is a trader, trading educator and community leader
          teaching technical analysis, risk management and trading
          psychology to a Ghanaian audience across Forex, Gold and crypto
          markets. His approach is built on responsible trading rather than
          &ldquo;get-rich-quick&rdquo; messaging.
        </p>

        <p className="mt-2 text-sm font-semibold text-white">
          HFM Affiliate ID: 30537791
        </p>

        {/* audience numbers */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Audience &amp; performance
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={<Users className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label={stats[0].label} value={stats[0].value} />
            <StatCard icon={<TrendingUp className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label={stats[1].label} value={stats[1].value} />
            <StatCard icon={<Users className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label={stats[2].label} value={stats[2].value} />
            <StatCard icon={<CalendarCheck className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label={stats[3].label} value={stats[3].value} />
          </div>
        </div>

        {/* platforms */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Platforms
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {platforms.map((p) => (
              <div key={p.name} className="card p-4 text-center">
                <p className="text-lg font-extrabold text-white">{p.followers}</p>
                <p className="text-xs text-zinc-400">{p.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* screenshots grid placeholder */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Content &amp; events
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-zinc-500"
              >
                Add photo/screenshot
              </div>
            ))}
          </div>
        </div>

        {/* testimonials */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Testimonials
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-5">
                <Quote className="h-4 w-4 text-brand-500" />
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-xs font-bold text-white">{t.name}</p>
                <p className="text-xs text-zinc-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* contact */}
        <div className="mt-16 rounded-3xl bg-brand-600 p-8 text-center">
          <h3 className="text-xl font-extrabold text-black">For partnership inquiries</h3>
          <p className="mt-1 text-sm text-black/70">hello@scoutsfx.com</p>
        </div>
      </Container>
    </section>
  );
}
