"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import type { Speaker } from "@/lib/events";
import Reveal from "@/components/Reveal";

function Tag({ tag }: { tag: Speaker["tag"] }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
        tag === "Host"
          ? "bg-brand-500 text-black"
          : "border border-white/20 bg-black/50 text-white backdrop-blur"
      }`}
    >
      {tag}
    </span>
  );
}

export default function SpeakersGrid({ speakers }: { speakers: Speaker[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? speakers[openIndex] : null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {speakers.map((s, i) => (
          <Reveal key={s.name} delay={i * 120}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 text-left transition-all duration-500 hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-glow"
            >
              <Image
                src={s.photo}
                alt={s.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute left-4 top-4">
                <Tag tag={s.tag} />
              </div>
              <span className="absolute right-4 top-4 text-5xl font-light tabular-nums text-white/15 transition-colors group-hover:text-brand-500/60">
                0{i + 1}
              </span>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="text-xl font-bold text-white">{s.name}</p>
                  <p className="mt-1 text-sm text-zinc-300">{s.role}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-500 group-hover:text-black">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative grid w-full max-w-3xl animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-card md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]">
              <Image src={active.photo} alt={active.name} fill sizes="(min-width: 768px) 384px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950/40" />
            </div>
            <div className="relative flex flex-col justify-center p-7 sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
              <div className="relative">
                <Tag tag={active.tag} />
                <p className="mt-5 text-2xl font-bold text-white">{active.name}</p>
                <p className="mt-1 text-sm font-semibold text-brand-500">{active.role}</p>
                <p className="mt-5 text-sm leading-relaxed text-zinc-300">{active.bio}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenIndex(null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-brand-500 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
