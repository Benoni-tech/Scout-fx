"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Speaker } from "@/lib/events";

export default function SpeakersGrid({ speakers }: { speakers: Speaker[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? speakers[openIndex] : null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {speakers.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group overflow-hidden rounded-3xl border border-ink-100 bg-white text-left shadow-card transition-shadow hover:shadow-pill"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gold-100">
              <Image
                src={s.photo}
                alt={s.name}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  s.tag === "Host"
                    ? "bg-success text-white"
                    : "bg-white/90 text-gold-800"
                }`}
              >
                {s.tag}
              </span>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-bold text-ink-900">{s.name}</p>
              <p className="mt-0.5 text-xs text-ink-500">{s.role}</p>
              <p className="mt-2 text-xs font-semibold text-gold-800">
                View bio
              </p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full bg-gold-100">
              <Image
                src={active.photo}
                alt={active.name}
                fill
                sizes="448px"
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpenIndex(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  active.tag === "Host"
                    ? "bg-success text-white"
                    : "bg-white/90 text-gold-800"
                }`}
              >
                {active.tag}
              </span>
            </div>
            <div className="p-6">
              <p className="text-lg font-extrabold text-ink-900">{active.name}</p>
              <p className="mt-0.5 text-sm font-semibold text-gold-800">
                {active.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-700">
                {active.bio}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
