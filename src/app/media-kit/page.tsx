import { Container, Eyebrow, StatCard, SecondaryButton } from "@/components/ui";
import { Users, TrendingUp, CalendarCheck, Download, Quote } from "lucide-react";

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

const testimonials = [
  { quote: "First educator I've followed who explains the why, not just the call.", name: "Kwabena A.", role: "Student" },
  { quote: "The seminar alone was worth more than three months of YouTube.", name: "Efua O.", role: "Community member" },
  { quote: "Straightforward, no hype, no guaranteed-returns nonsense.", name: "Yaw B.", role: "Community member" },
];

export default function MediaKitPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Eyebrow>Media kit</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Scout FX
            </h1>
            <p className="mt-2 text-base font-semibold text-brand-800">
              Trader · Educator · Community Leader
            </p>
          </div>
          <SecondaryButton href="/media-kit">
            <Download className="mr-2 h-4 w-4" /> Download one-pager
          </SecondaryButton>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-500">
          Scout FX is a trader, trading educator and community leader
          teaching technical analysis, risk management and trading
          psychology to a Ghanaian audience across Forex, Gold and crypto
          markets. His approach is built on responsible trading rather than
          &ldquo;get-rich-quick&rdquo; messaging.
        </p>

        <p className="mt-2 text-sm font-semibold text-ink-900">
          HFM Affiliate ID: 30537791
        </p>

        {/* audience numbers */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Audience &amp; performance
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={<Users className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-50" label={stats[0].label} value={stats[0].value} />
            <StatCard icon={<TrendingUp className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-600" label={stats[1].label} value={stats[1].value} />
            <StatCard icon={<Users className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-50" label={stats[2].label} value={stats[2].value} />
            <StatCard icon={<CalendarCheck className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-600" label={stats[3].label} value={stats[3].value} />
          </div>
        </div>

        {/* platforms */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Platforms
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {platforms.map((p) => (
              <div key={p.name} className="rounded-2xl border border-ink-100 bg-white p-4 text-center">
                <p className="text-lg font-extrabold text-ink-900">{p.followers}</p>
                <p className="text-xs text-ink-500">{p.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* screenshots grid placeholder */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Content &amp; events
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-ink-100 bg-ink-100/20 text-xs text-ink-300"
              >
                Add photo/screenshot
              </div>
            ))}
          </div>
        </div>

        {/* testimonials */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Testimonials
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-ink-100 bg-white p-5">
                <Quote className="h-4 w-4 text-brand-800" />
                <p className="mt-2 text-sm leading-relaxed text-ink-700">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-xs font-bold text-ink-900">{t.name}</p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* contact */}
        <div className="mt-16 rounded-3xl bg-brand-600 p-8 text-center">
          <h3 className="text-xl font-extrabold text-ink-900">For partnership inquiries</h3>
          <p className="mt-1 text-sm text-ink-900">hello@scoutsfx.com</p>
        </div>
      </Container>
    </section>
  );
}
