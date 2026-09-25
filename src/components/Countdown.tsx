"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function diff(targetISO: string): TimeLeft {
  const ms = new Date(targetISO).getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export default function Countdown({ targetISO }: { targetISO: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = diff(targetISO);
      setTimeLeft(remaining);
      setIsLive(new Date(targetISO).getTime() - Date.now() <= 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  if (isLive) {
    return (
      <div className="flex items-center justify-center gap-3 card rounded-3xl p-6 shadow-card">
        <PartyPopper className="h-5 w-5 text-brand-500" />
        <p className="text-sm font-bold text-white">
          We&apos;re live. The event has started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 divide-x divide-white/10 card rounded-3xl p-4 shadow-card sm:p-6">
      {units.map((u) => (
        <div key={u.key} className="text-center">
          <p className="text-2xl font-extrabold tabular-nums text-brand-500 sm:text-4xl">
            {String(timeLeft[u.key]).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
            {u.label}
          </p>
        </div>
      ))}
    </div>
  );
}
