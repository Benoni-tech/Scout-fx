/** "Need to know" key points shown under an article's title. */
export default function Highlights({ items }: { items: string[] }) {
  const points = items.filter((i) => i.trim());
  if (!points.length) return null;
  return (
    <aside className="relative mt-10" aria-label="Need to know">
      {/* hatched offset shadow */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl opacity-40"
        style={{ backgroundImage: "repeating-linear-gradient(-45deg, #FBFE00 0 1px, transparent 1px 5px)" }}
      />
      <div className="relative rounded-2xl border border-white/25 bg-black px-6 pb-6 pt-8 sm:px-8">
        <h2 className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white">
          Need to know
        </h2>
        <ul className="space-y-3">
          {points.map((p, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-zinc-200">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
