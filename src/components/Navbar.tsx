"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/education", label: "Education" },
  { href: "/events", label: "Events" },
  { href: "/signals", label: "Signals" },
  { href: "/media-kit", label: "Media Kit" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-black/70 shadow-pill"
            : "border-white/5 bg-black/30"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 pl-2">
          <Image src="/logo.png" alt="" width={22} height={25} className="h-6 w-auto" />
          <span className="text-[15px] font-extrabold uppercase tracking-tight text-white">
            Scout FX
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/join"
            className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Join free
          </Link>
          <Link
            href="/open-account"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-brand-700 hover:shadow-glow"
          >
            Open HFM account
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl animate-fade-up rounded-3xl border border-white/10 bg-black/90 p-4 shadow-pill backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive(l.href) ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Link
                href="/join"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Join free
              </Link>
              <Link
                href="/open-account"
                onClick={() => setOpen(false)}
                className="rounded-full bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-black"
              >
                Open HFM account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
