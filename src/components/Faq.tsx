import { Plus } from "lucide-react";
import type { Faq as FaqItem } from "@/lib/events";

/** Accessible accordion built on <details>, so it works without JavaScript. */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.02]">
      {items.map((f, i) => (
        <details key={f.q} className="group px-6 sm:px-8" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="text-base font-semibold text-white transition-colors group-open:text-brand-500">
              {f.q}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-open:rotate-45 group-open:border-brand-500 group-open:bg-brand-500 group-open:text-black">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="-mt-1 max-w-2xl animate-fade-up pb-6 text-sm leading-relaxed text-zinc-400">
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
