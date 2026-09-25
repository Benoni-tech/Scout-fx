import { Container, Eyebrow, PrimaryButton } from "@/components/ui";
import { ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";

const reasons = [
  {
    title: "Regulated broker",
    desc: "HFM operates under recognized regulatory oversight across multiple jurisdictions.",
  },
  {
    title: "Fast, low-friction funding",
    desc: "Mobile money and card deposits supported for Ghanaian traders.",
  },
  {
    title: "The broker I actually trade through",
    desc: "Every seminar, education post and signal is built around HFM's platform.",
  },
];

const steps = [
  { n: "1", label: "Open an account", desc: "Register through the link below. Takes a few minutes." },
  { n: "2", label: "Verify", desc: "Complete HFM's standard KYC verification." },
  { n: "3", label: "Start trading", desc: "Fund your account and apply what you've learned." },
];

// TODO: replace with the live HFM affiliate link (Affiliate ID: 30537791)
const HFM_AFFILIATE_LINK = "https://www.hfm.com/register?ref=30537791";

export default function OpenAccountPage() {
  return (
    <section className="bg-grid py-16">
      <Container className="text-center">
        <Eyebrow>HFM Affiliate ID: 30537791</Eyebrow>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
          Trade with HFM
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
          The broker I use and teach through. One link, one place to start.
        </p>

        <div className="mx-auto mt-6 flex max-w-lg items-start gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4 text-left">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <p className="text-xs leading-relaxed text-zinc-300">
            Trading forex, gold and CFDs carries a high level of risk and can
            result in the loss of your capital. Nothing here is a guarantee
            of profit. Read the{" "}
            <a href="/legal/risk-disclosure" className="underline">
              full risk disclosure
            </a>{" "}
            before you trade.
          </p>
        </div>

        <div className="mt-8">
          <PrimaryButton href={HFM_AFFILIATE_LINK}>
            Open HFM account <ArrowRight className="ml-2 h-4 w-4" />
          </PrimaryButton>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="card p-5">
              <ShieldCheck className="h-5 w-5 text-brand-500" />
              <h3 className="mt-3 text-sm font-bold text-white">{r.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            What happens next
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-black">
                  {s.n}
                </div>
                <h4 className="mt-3 text-sm font-bold text-white">{s.label}</h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
