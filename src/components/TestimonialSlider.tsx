"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialSlider({
  items,
  interval = 6000,
}: {
  items: Testimonial[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => go(1), interval);
    return () => clearInterval(id);
  }, [paused, count, interval, go]);

  if (count === 0) return null;

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="card relative overflow-hidden rounded-3xl px-6 py-12 sm:px-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl" />
        <Quote className="relative mx-auto h-8 w-8 text-brand-500" />

        <div className="relative mt-6 grid">
          {items.map((t, i) => (
            <figure
              key={t.name}
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 text-center transition-all duration-700 ease-out ${
                i === index
                  ? "translate-x-0 opacity-100"
                  : i < index
                    ? "pointer-events-none -translate-x-8 opacity-0"
                    : "pointer-events-none translate-x-8 opacity-0"
              }`}
            >
              <blockquote className="text-gradient text-xl font-semibold leading-snug sm:text-3xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-black">
                  {t.name[0]}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-white">{t.name}</span>
                  <span className="block text-xs text-zinc-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {items.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-brand-500" : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-500 hover:text-brand-500"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-black transition-all hover:shadow-glow"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
