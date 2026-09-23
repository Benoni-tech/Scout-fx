"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-ink-100 bg-white/90 px-4 py-2.5 shadow-pill backdrop-blur">
        <Link href="/" className="flex items-center gap-2 pl-2">
          <Image src="/logo.png" alt="" width={22} height={26} className="h-6 w-auto" />
          <span className="text-[15px] font-extrabold tracking-tight text-ink-900">
            Scout Cartel
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/join"
            className="rounded-full border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-100/50"
          >
            Join free
          </Link>
          <Link
            href="/open-account"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Open HFM account
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink-900 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-ink-100 bg-white p-4 shadow-pill md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100/50"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-ink-100 pt-3">
              <Link
                href="/join"
                onClick={() => setOpen(false)}
                className="rounded-full border border-ink-100 px-4 py-2.5 text-center text-sm font-semibold text-ink-900"
              >
                Join free
              </Link>
              <Link
                href="/open-account"
                onClick={() => setOpen(false)}
                className="rounded-full bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
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
