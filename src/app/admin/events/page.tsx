"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, RefreshCw, Search, Users, ScanLine } from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";
import { upcomingEvents } from "@/lib/events";
import { SOURCE_LABELS } from "@/lib/utm";

type Row = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  attended: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  createdAt: string;
};

function fmt(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Registrations from before source tracking have no utm_source.
const UNTRACKED = "not tracked";
const srcOf = (r: Row) => r.utm_source || UNTRACKED;
const label = (s: string) => SOURCE_LABELS[s] ?? s;

function csvCell(v: unknown) {
  let s = String(v ?? "");
  // Stop spreadsheet apps treating user-entered text as a formula.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AdminEventsPage() {
  const { authFetch } = useAdmin();
  const [eventId, setEventId] = useState(upcomingEvents[0]?.id ?? "");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const [busyId, setBusyId] = useState("");
  const [source, setSource] = useState("");

  const load = useCallback(async () => {
    setRows(null);
    setError("");
    try {
      const res = await authFetch(`/api/admin/rsvps?eventId=${encodeURIComponent(eventId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't load registrations.");
      setRows(data.rsvps);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load registrations.");
      setRows([]);
    }
  }, [authFetch, eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (filter === "in" && !r.attended) return false;
      if (filter === "out" && r.attended) return false;
      if (source && srcOf(r) !== source) return false;
      if (!q) return true;
      return [r.name, r.email, r.whatsapp, r.id].some((f) =>
        f?.toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter, source]);

  // Registrations per source, biggest first.
  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows ?? []) counts.set(srcOf(r), (counts.get(srcOf(r)) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const checkedIn = rows?.filter((r) => r.attended).length ?? 0;

  async function toggle(row: Row) {
    if (row.attended && !confirm(`Undo check-in for ${row.name}?`)) return;
    setBusyId(row.id);
    const res = await authFetch("/api/admin/checkin", {
      method: "POST",
      body: JSON.stringify({ code: row.id, undo: row.attended }),
    });
    setBusyId("");
    if (res.ok || res.status === 409) load();
    else alert((await res.json().catch(() => ({})))?.error || "Check-in failed.");
  }

  function exportCsv() {
    const header = ["Ticket", "Name", "Email", "WhatsApp", "Registered", "Checked in", "Checked in at", "Checked in by", "Source", "Medium", "Campaign", "Form"];
    const lines = (rows ?? []).map((r) =>
      [r.id, r.name, r.email, r.whatsapp, r.createdAt, r.attended ? "yes" : "no", r.checkedInAt, r.checkedInBy, srcOf(r), r.utm_medium, r.utm_campaign, r.source]
        .map(csvCell)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${eventId}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="py-8">
      <Container className="max-w-none px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Events</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Event registrations
            </h1>
            {upcomingEvents.length > 1 ? (
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="mt-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white"
              >
                {upcomingEvents.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">{upcomingEvents[0]?.title}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={exportCsv}
              disabled={!rows?.length}
              className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
          <StatCard icon={<Users className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Registered" value={rows ? String(rows.length) : "…"} />
          <StatCard icon={<ScanLine className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Checked in" value={rows ? String(checkedIn) : "…"} />
        </div>

        {sources.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sources</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sources.map(([name, count]) => {
                const active = source === name;
                const pct = rows?.length ? Math.round((count / rows.length) * 100) : 0;
                return (
                  <button
                    key={name}
                    onClick={() => setSource(active ? "" : name)}
                    title={active ? "Show all sources" : `Show only ${label(name)}`}
                    className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                      active ? "border-brand-500 bg-brand-500/10" : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-xs text-zinc-400">{label(name)}</span>
                    <span className="text-lg font-bold text-white">{count}</span>
                    <span className="ml-1.5 text-xs text-zinc-500">{pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, code"
              className="w-full rounded-full border border-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
            />
          </div>
          <div className="flex gap-1">
            {([["all", "All"], ["in", "Checked in"], ["out", "Not yet"]] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  filter === k ? "bg-white text-black" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Ticket</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Registered</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows === null && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-400" />
                  </td>
                </tr>
              )}
              {rows && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                    {rows.length ? "No matches." : "No registrations yet."}
                  </td>
                </tr>
              )}
              {visible.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-semibold text-white">{r.name}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    <div>{r.email}</div>
                    <a
                      href={`https://wa.me/${r.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:underline"
                    >
                      {r.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{r.id}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${r.utm_source ? "text-white" : "text-zinc-500"}`}>
                      {label(srcOf(r))}
                    </span>
                    {(r.utm_medium || r.utm_campaign) && (
                      <div className="text-xs text-zinc-500">
                        {[r.utm_medium, r.utm_campaign].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(r)}
                      disabled={busyId === r.id}
                      title={r.attended ? `By ${r.checkedInBy ?? "unknown"}. Click to undo.` : "Admit"}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
                        r.attended
                          ? "bg-brand-600 text-black"
                          : "border border-white/10 text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      {busyId === r.id && <Loader2 className="h-3 w-3 animate-spin" />}
                      {r.attended ? `In · ${fmt(r.checkedInAt)}` : "Check in"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
