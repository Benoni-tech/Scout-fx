import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, MessageCircle } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/education", label: "Education" },
      { href: "/events", label: "Events" },
      { href: "/signals", label: "Signals" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/join", label: "Join free" },
      { href: "/seed-program", label: "Seed Program" },
      { href: "/media-kit", label: "Media kit" },
      { href: "/events", label: "Upcoming seminars" },
      { href: "/open-account", label: "Open HFM account" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/education", label: "Education library" },
      { href: "/signals/history", label: "Signal track record" },
      { href: "/legal/risk-disclosure", label: "Risk disclosure" },
      { href: "/legal/terms", label: "Terms of service" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/partnerships", label: "Partnerships" },
      { href: "/compliance", label: "Compliance" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                We scout opportunities and make{" "}
                <span className="text-brand-500">trading easier.</span>
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Crypto, forex, stocks and commodities, taught properly.
              </p>
            </div>
            <Link
              href="/join"
              className="whitespace-nowrap rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-700 hover:shadow-glow"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={22} height={25} className="h-6 w-auto" />
              <span className="text-[15px] font-extrabold uppercase tracking-tight text-white">
                Scout FX
              </span>
            </Link>
            <p className="mt-3 max-w-[220px] text-sm text-zinc-400">
              Trading education, community and rule-based signals for
              Ghanaian traders.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                aria-label="Twitter / X"
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-black transition-colors hover:bg-brand-700"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                aria-label="LinkedIn"
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-black transition-colors hover:bg-brand-700"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                aria-label="WhatsApp community"
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-black transition-colors hover:bg-brand-700"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-brand-500"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-xs leading-relaxed text-zinc-500">
            Trading forex, gold and crypto carries a high level of risk and
            may not be suitable for all investors. Past performance is not
            indicative of future results. Nothing on this site is a guarantee
            of profit. See our{" "}
            <Link href="/legal/risk-disclosure" className="underline">
              risk disclosure
            </Link>{" "}
            before trading.
          </p>
          <p className="mt-4 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Scout FX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
