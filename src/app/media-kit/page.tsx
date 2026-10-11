import { testimonials } from "@/lib/testimonials";
import { Container, Eyebrow, StatCard } from "@/components/ui";
import { Users, TrendingUp, Megaphone, Quote } from "lucide-react";
import { SOCIAL_LINKS, WHATSAPP_CONTACT } from "@/lib/social";
import { buildMetadata } from "@/lib/seo";

const stats = [
  { label: "Students helped", value: "4,000+" },
  { label: "Followers online", value: "2,000+" },
  { label: "Win rate", value: "58%" },
];

const platforms = [
  { name: "Facebook", handle: "scoutsfx26", href: SOCIAL_LINKS.facebook },
  { name: "Instagram", handle: "@scoutsfx26", href: SOCIAL_LINKS.instagram },
  { name: "LinkedIn", handle: "Scout FX", href: SOCIAL_LINKS.linkedin },
  { name: "WhatsApp", handle: "+233 54 462 4401", href: WHATSAPP_CONTACT },
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
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={<Users className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label={stats[0].label} value={stats[0].value} />
            <StatCard icon={<Megaphone className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label={stats[1].label} value={stats[1].value} />
            <StatCard icon={<TrendingUp className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label={stats[2].label} value={stats[2].value} />
          </div>
        </div>

        {/* platforms */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Platforms
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover p-4 text-center"
              >
                <p className="text-lg font-extrabold text-white">{p.name}</p>
                <p className="text-xs text-zinc-400">{p.handle}</p>
              </a>
            ))}
          </div>
        </div>

        {/* testimonials (hidden while there are none) */}
        {testimonials.length > 0 && (
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
        )}

        {/* contact */}
        <div className="mt-16 rounded-3xl bg-brand-600 p-8 text-center">
          <h3 className="text-xl font-extrabold text-black">For partnership inquiries</h3>
          <p className="mt-1 text-sm text-black/70">hello@scoutsfx.com</p>
        </div>
      </Container>
    </section>
  );
}
