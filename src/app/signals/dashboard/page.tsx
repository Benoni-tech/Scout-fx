"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

// TODO: replace with a live Firestore query against `signals`,
// ordered by createdAt desc, filtered to status === "active"
const liveSignals = [
  { pair: "XAU/USD", direction: "BUY", entry: 2415.5, stop: 2408.0, target: 2431.0, rule: "RSI oversold bounce", time: "12 min ago" },
  { pair: "EUR/USD", direction: "SELL", entry: 1.0862, stop: 1.089, target: 1.0805, rule: "MA cross + resistance rejection", time: "1h ago" },
  { pair: "GBP/USD", direction: "BUY", entry: 1.2634, stop: 1.26, target: 1.2705, rule: "Support bounce + RSI reversal", time: "3h ago" },
];

export default function SignalsDashboardPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const accepted = localStorage.getItem("signals_disclosure_accepted");
    setAllowed(accepted === "true");
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <Container className="py-24 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-danger" />
        <h1 className="mt-4 text-2xl font-extrabold text-white">
          Risk disclosure required
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          You need to accept the risk disclosure before viewing live signals.
        </p>
        <Link
          href="/signals/disclosure"
          className="mt-6 inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-black"
        >
          Go to risk disclosure
        </Link>
      </Container>
    );
  }

  return (
    <section className="py-16">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Live signals
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Updated automatically as new signals fire.
            </p>
          </div>
          <Link
            href="/signals/history"
            className="whitespace-nowrap text-sm font-semibold text-brand-500"
          >
            Full history →
          </Link>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <p className="text-xs leading-relaxed text-zinc-300">
            Signals are not guaranteed outcomes. Trade at your own risk and
            within your own risk tolerance.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {liveSignals.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    s.direction === "BUY" ? "bg-brand-600" : "bg-danger/10"
                  }`}
                >
                  {s.direction === "BUY" ? (
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-danger" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {s.pair} · {s.direction}
                  </p>
                  <p className="text-xs text-zinc-400">{s.rule}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-xs sm:gap-8">
                <div>
                  <p className="text-zinc-500">Entry</p>
                  <p className="font-semibold text-white">{s.entry}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Stop</p>
                  <p className="font-semibold text-white">{s.stop}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Target</p>
                  <p className="font-semibold text-white">{s.target}</p>
                </div>
              </div>

              <p className="whitespace-nowrap text-xs text-zinc-500">{s.time}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
