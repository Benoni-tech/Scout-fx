import Link from "next/link";
import Image from "next/image";
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { SOCIAL_LINKS, WHATSAPP_CONTACT } from "@/lib/social";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/join", label: "Join free" },
      { href: "/media-kit", label: "Media kit" },
      { href: "/events", label: "Upcoming seminars" },
      { href: "/open-account", label: "Open HFM account" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Trading lessons" },
      { href: "/legal/risk-disclosure", label: "Risk disclosure" },
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/privacy", label: "Privacy policy" },
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

export default function Footer({ seedOpen = false }: { seedOpen?: boolean }) {
  // The Seed Program link appears only while its registration is open.
  const cols = columns.map((c) =>
    c.title === "Community" && seedOpen
      ? { ...c, links: [c.links[0], { href: "/seed-program", label: "Seed Program" }, ...c.links.slice(1)] }
      : c
  );
  return (
    <footer className="mt-24 border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={22} height={25} className="h-6 w-auto" />
              <span className="text-[15px] font-extrabold uppercase tracking-tight text-white">
                Scout FX
              </span>
            </Link>
            <p className="mt-3 max-w-[220px] text-sm text-zinc-400">
              Trading education, free seminars and community for
              Ghanaian traders.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                aria-label="Scout FX on Facebook"
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-7 w-7 text-white transition-colors hover:text-brand-500"
              >
                <FacebookIcon className="h-7 w-7" />
              </a>
              <a
                aria-label="Scout FX on Instagram"
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-7 w-7 text-white transition-colors hover:text-brand-500"
              >
                <InstagramIcon className="h-7 w-7" />
              </a>
              <a
                aria-label="Scout FX on LinkedIn"
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-7 w-7 text-white transition-colors hover:text-brand-500"
              >
                <LinkedInIcon className="h-7 w-7" />
              </a>
              <a
                aria-label="Scout FX on WhatsApp"
                href={WHATSAPP_CONTACT}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-7 w-7 text-white transition-colors hover:text-brand-500"
              >
                <WhatsAppIcon className="h-7 w-7" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
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
