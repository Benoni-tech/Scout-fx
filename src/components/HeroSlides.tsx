"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HeroImage } from "@/lib/events";

const EVERY_MS = 6000;

/**
 * Full-bleed photo background: crossfades between the photos (paused for people
 * who prefer reduced motion), with a dark wash so text on top stays readable.
 * "hero" shows a 01–03 indicator on the right; "panel" (the sign-up photo panel)
 * shows dots bottom-left.
 */
export default function HeroSlides({ images, variant = "hero" }: { images: HeroImage[]; variant?: "hero" | "panel" }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), EVERY_MS);
    return () => clearInterval(id);
  }, [images.length]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div className="absolute inset-0 -z-10">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={variant === "hero" && i === 0}
            sizes={variant === "hero" ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
            className={`object-cover transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: img.position ?? "center" }}
          />
        ))}
        {variant === "hero" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          </>
        )}
      </div>

      {variant === "panel" && images.length > 1 && (
        <div className="absolute bottom-7 left-7 z-10 flex gap-1.5 sm:left-10">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-brand-500" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      )}

      {variant === "hero" && images.length > 1 && (
        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 text-[11px] font-semibold tabular-nums text-zinc-300 sm:flex">
          <span>{pad(active + 1)}</span>
          <div className="flex flex-col gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`w-[3px] rounded-full transition-all duration-500 ${i === active ? "h-12 bg-brand-500" : "h-6 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
          <span className="text-zinc-500">{pad(images.length)}</span>
        </div>
      )}
    </>
  );
}
