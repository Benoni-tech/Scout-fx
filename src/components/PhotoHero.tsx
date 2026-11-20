import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import HeroSlides from "@/components/HeroSlides";
import type { HeroImage } from "@/lib/events";

export type HeroFact = { label: string; value: ReactNode };

/**
 * Full-width photo hero used on the events pages: sliding photos edge to edge,
 * a left-aligned title (yellow rule after the first line), one button and a row
 * of key facts along the bottom.
 */
export default function PhotoHero({
  images,
  firstLine,
  lastLine,
  accent,
  intro,
  cta,
  facts = [],
  back,
  caption,
}: {
  images: HeroImage[];
  firstLine?: string;
  lastLine: string;
  /** Shown in yellow after the last line, e.g. " 2026". */
  accent?: string;
  intro?: ReactNode;
  cta?: { href: string; label: string };
  facts?: HeroFact[];
  back?: { href: string; label: string };
  caption?: string;
}) {
  return (
    <section className="relative isolate -mt-24 flex min-h-[640px] flex-col overflow-hidden sm:min-h-[720px]">
      <HeroSlides images={images} />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-32 sm:px-6">
        {(back || caption) && (
          <div className="flex items-center justify-between gap-4">
            {back ? (
              <Link href={back.href} className="inline-flex items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {back.label}
              </Link>
            ) : (
              <span />
            )}
            {caption && <p className="hidden text-xs text-zinc-400 sm:block">{caption}</p>}
          </div>
        )}

        <div className="mt-auto max-w-3xl pt-16">
          <h1 className="animate-fade-up text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl">
            {firstLine && (
              <span className="flex items-center gap-5">
                {firstLine}
                <span className="hidden h-px w-28 bg-brand-500/80 sm:block md:w-40" aria-hidden />
              </span>
            )}
            <span className="block">
              {lastLine}
              {accent && <span className="text-brand-500">{accent}</span>}
            </span>
          </h1>
          {intro && (
            <div className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-zinc-300 sm:text-lg" style={{ animationDelay: "80ms" }}>
              {intro}
            </div>
          )}
          {cta && (
            <Link href={cta.href} className="group mt-8 inline-flex animate-fade-up items-center gap-1" style={{ animationDelay: "160ms" }}>
              <span className="rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors group-hover:bg-brand-600">
                {cta.label}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-black transition-transform duration-300 group-hover:rotate-45 group-hover:bg-brand-600">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          )}
        </div>

        {facts.length > 0 && (
          <div className={`mt-10 grid gap-2 sm:gap-3 ${facts.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
            {facts.map((f, i) => (
              <div
                key={f.label}
                className={`rounded-2xl border px-5 py-3.5 backdrop-blur-md ${
                  i === 0 ? "border-white bg-white text-black" : "border-white/15 bg-white/10 text-white"
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 ? "text-zinc-500" : "text-zinc-300"}`}>{f.label}</p>
                <p className="mt-0.5 text-sm font-semibold">{f.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
