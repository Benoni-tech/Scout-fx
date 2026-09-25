import type { ReactElement } from "react";
import Image from "next/image";
import type { Article } from "@/lib/articles";

const Y = "#FBFE00";

// small deterministic PRNG so each article gets its own (stable) artwork
function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function Candles({ rnd }: { rnd: () => number }) {
  let price = 110;
  const candles = Array.from({ length: 14 }, (_, i) => {
    const open = price;
    price = Math.max(40, Math.min(170, price + (rnd() - 0.42) * 30));
    const hi = Math.max(open, price) + rnd() * 12;
    const lo = Math.min(open, price) - rnd() * 12;
    return { x: 30 + i * 26, open, close: price, hi, lo };
  });
  const line = candles.map((c) => `${c.x},${200 - c.close}`).join(" ");
  return (
    <>
      {candles.map((c) => {
        const up = c.close <= c.open;
        return (
          <g key={c.x} opacity={up ? 1 : 0.45}>
            <line x1={c.x} x2={c.x} y1={200 - c.hi} y2={200 - c.lo} stroke={up ? Y : "#fff"} strokeWidth="1.5" />
            <rect
              x={c.x - 6}
              width="12"
              y={200 - Math.max(c.open, c.close)}
              height={Math.max(3, Math.abs(c.open - c.close))}
              rx="2"
              fill={up ? Y : "#fff"}
            />
          </g>
        );
      })}
      <polyline points={line} fill="none" stroke={Y} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="4 4" />
    </>
  );
}

function Rings({ rnd }: { rnd: () => number }) {
  const cx = 250 + rnd() * 80;
  return (
    <>
      {[30, 60, 90, 120, 150].map((r, i) => (
        <circle key={r} cx={cx} cy={110} r={r} fill="none" stroke={i === 1 ? Y : "#fff"} strokeOpacity={i === 1 ? 0.9 : 0.12} strokeWidth={i === 1 ? 2 : 1} />
      ))}
      <path d={`M ${cx} 110 L ${cx + 60 * Math.cos(-0.8)} ${110 + 60 * Math.sin(-0.8)}`} stroke={Y} strokeWidth="2" />
      <circle cx={cx} cy={110} r="5" fill={Y} />
    </>
  );
}

function Waves({ rnd }: { rnd: () => number }) {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const amp = 18 + rnd() * 30;
        const f = 0.015 + rnd() * 0.01;
        const pts = Array.from({ length: 41 }, (_, k) => {
          const x = k * 11;
          return `${x},${110 + i * 6 - 15 + Math.sin(x * f + i) * amp}`;
        }).join(" ");
        return <polyline key={i} points={pts} fill="none" stroke={i === 2 ? Y : "#fff"} strokeOpacity={i === 2 ? 1 : 0.15} strokeWidth={i === 2 ? 2 : 1} />;
      })}
    </>
  );
}

function Bars({ rnd }: { rnd: () => number }) {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const h = 30 + i * 9 + rnd() * 30;
        return <rect key={i} x={40 + i * 30} y={190 - h} width="16" height={h} rx="3" fill={i === 9 ? Y : "#fff"} fillOpacity={i === 9 ? 1 : 0.1 + i * 0.03} />;
      })}
    </>
  );
}

const motifs: Record<string, (p: { rnd: () => number }) => ReactElement> = {
  "Technical Analysis": Candles,
  "Risk Management": Rings,
  "Trading Psychology": Waves,
  "Market Basics": Bars,
};

export default function ArticleCover({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  if (article.image) {
    return (
      <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
        <Image src={article.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
    );
  }

  const rnd = seeded(article.slug);
  const Motif = motifs[article.category] ?? Candles;
  const glowX = 20 + rnd() * 60;

  return (
    <div
      className={`relative overflow-hidden bg-zinc-950 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at ${glowX}% 0%, rgba(251,254,0,0.18), transparent 60%)`,
      }}
      aria-hidden
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <svg viewBox="0 0 440 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <Motif rnd={rnd} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950 to-transparent" />
    </div>
  );
}
