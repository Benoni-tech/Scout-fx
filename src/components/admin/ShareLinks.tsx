"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { eventSharers, type EventItem } from "@/lib/events";
import { SOURCE_LABELS } from "@/lib/utm";

const SITE = "https://scoutsfx.com";

const PLATFORMS = ["whatsapp", "facebook", "instagram", "linkedin", "x", "tiktok", "telegram"];
const PLACEMENTS = ["status", "story", "post", "group", "broadcast", "bio", "dm", "ad"];

// The set handed to a speaker with "Copy all": the places people usually share an event.
const BUNDLE: [string, string][] = [
  ["whatsapp", "status"],
  ["whatsapp", "group"],
  ["facebook", "status"],
  ["facebook", "post"],
  ["instagram", "story"],
  ["instagram", "bio"],
  ["linkedin", "post"],
  ["x", "post"],
  ["tiktok", "bio"],
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function shareUrl(event: EventItem, ref: string, platform: string, placement: string) {
  const p = new URLSearchParams({
    ref,
    utm_source: platform,
    utm_medium: placement,
    utm_campaign: event.campaign ?? event.id,
  });
  return `${SITE}/events/${event.id}?${p}`;
}

/** Builds tagged share links per person and platform, so registrations can be credited. */
export default function ShareLinks({ event }: { event: EventItem }) {
  const sharers = useMemo(() => eventSharers(event), [event]);
  const [ref, setRef] = useState(sharers[0].ref);
  const [platform, setPlatform] = useState("facebook");
  const [placement, setPlacement] = useState("status");
  const [copied, setCopied] = useState("");

  const url = shareUrl(event, ref, platform, placement);
  const who = sharers.find((s) => s.ref === ref)?.name ?? ref;

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      prompt("Copy this:", text);
    }
  }

  function copyAll() {
    const lines = BUNDLE.map(
      ([pf, pl]) => `${SOURCE_LABELS[pf] ?? cap(pf)} ${pl}:\n${shareUrl(event, ref, pf, pl)}`
    );
    copy(`${event.title}: your share links (${who})\n\n${lines.join("\n\n")}`, "all");
  }

  const select = "rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white";

  return (
    <div className="card mt-6 p-5">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-brand-500" />
        <p className="text-sm font-bold text-white">Share links</p>
      </div>
      <p className="mt-1 text-xs text-zinc-400">
        Give each person their own link per platform. Registrations through it are credited to them below.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-xs text-zinc-400">
          <span className="mb-1 block">Shared by</span>
          <select value={ref} onChange={(e) => setRef(e.target.value)} className={select}>
            {sharers.map((s) => (
              <option key={s.ref} value={s.ref}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-zinc-400">
          <span className="mb-1 block">Platform</span>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={select}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{SOURCE_LABELS[p] ?? cap(p)}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-zinc-400">
          <span className="mb-1 block">Where</span>
          <select value={placement} onChange={(e) => setPlacement(e.target.value)} className={select}>
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>{p === "dm" ? "Direct message" : cap(p)}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 break-all rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">
          {url}
        </code>
        <div className="flex gap-2">
          <button
            onClick={() => copy(url, "one")}
            className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-black"
          >
            {copied === "one" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === "one" ? "Copied" : "Copy link"}
          </button>
          <button
            onClick={copyAll}
            title={`Every common platform for ${who}, ready to paste into a message`}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            {copied === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === "all" ? "Copied" : `Copy all for ${who}`}
          </button>
        </div>
      </div>
    </div>
  );
}
