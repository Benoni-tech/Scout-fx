"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, RefreshCw, Search, Users, ScanLine } from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";
import { eventSharers, upcomingEvents } from "@/lib/events";
import ShareLinks from "@/components/admin/ShareLinks";
import { SOURCE_LABELS } from "@/lib/utm";
import { nameKey, normalizeGhanaPhone } from "@/lib/validation";

type Row = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  ref?: string;
  attended: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  cancelled?: boolean;
  cancelledBy?: string | null;
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
// Registrations that didn't come through anyone's share link.
const NO_SHARER = "";

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
  const [filter, setFilter] = useState<"all" | "in" | "out" | "cancelled">("all");
  const [busyId, setBusyId] = useState("");
  const [source, setSource] = useState("");
  const [sharer, setSharer] = useState<string | null>(null);
  const event = upcomingEvents.find((e) => e.id === eventId);
  const sharerName = useMemo(() => {
    const names = new Map((event ? eventSharers(event) : []).map((s) => [s.ref, s.name]));
    return (ref: string) => (ref === NO_SHARER ? "No share link" : names.get(ref) ?? ref);
  }, [event]);

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
      // Cancelled tickets only show under their own tab.
      if ((filter === "cancelled") !== !!r.cancelled) return false;
      if (filter === "in" && !r.attended) return false;
      if (filter === "out" && r.attended) return false;
      if (source && srcOf(r) !== source) return false;
      if (sharer !== null && (r.ref ?? NO_SHARER) !== sharer) return false;
      if (!q) return true;
      return [r.name, r.email, r.whatsapp, r.id].some((f) =>
        f?.toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter, source, sharer]);

  // Counts and breakdowns leave out cancelled tickets.
  const active = useMemo(() => (rows ?? []).filter((r) => !r.cancelled), [rows]);
  const cancelledCount = (rows?.length ?? 0) - active.length;

  // Same name registered more than once: flagged for a look, not blocked (names repeat).
  const repeatedNames = useMemo(() => {
    const seen = new Map<string, number>();
    for (const r of active) seen.set(nameKey(r.name), (seen.get(nameKey(r.name)) ?? 0) + 1);
    return new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));
  }, [active]);

  function flagsOf(r: Row) {
    const flags: string[] = [];
    if (!normalizeGhanaPhone(r.whatsapp)) flags.push("Non-Ghana number");
    if (!r.cancelled && repeatedNames.has(nameKey(r.name))) flags.push("Possible duplicate");
    return flags;
  }

  // Per person who shared: registrations, how many turned up, and on which platforms.
  const bySharer = useMemo(() => {
    const table = new Map<string, { total: number; attended: number; platforms: Map<string, number> }>();
    // Everyone with a link is listed, even before their first registration.
    for (const s of event ? eventSharers(event) : []) table.set(s.ref, { total: 0, attended: 0, platforms: new Map() });
    for (const r of active) {
      const key = r.ref ?? NO_SHARER;
      const t = table.get(key) ?? { total: 0, attended: 0, platforms: new Map() };
      t.total++;
      if (r.attended) t.attended++;
      t.platforms.set(srcOf(r), (t.platforms.get(srcOf(r)) ?? 0) + 1);
      table.set(key, t);
    }
    if (!table.get(NO_SHARER)?.total) table.delete(NO_SHARER);
    return [...table].sort((a, b) => b[1].total - a[1].total);
  }, [active, event]);
  const sharerPlatforms = useMemo(
    () => [...new Set(bySharer.flatMap(([, t]) => [...t.platforms.keys()]))],
    [bySharer]
  );

  // Registrations per source, biggest first.
  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of active) counts.set(srcOf(r), (counts.get(srcOf(r)) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [active]);

  const checkedIn = active.filter((r) => r.attended).length;

  async function setCancelled(row: Row, cancel: boolean) {
    const msg = cancel
      ? `Cancel ${row.name}'s ticket? Their QR will show "Cancelled" at the gate. You can restore it later.`
      : `Restore ${row.name}'s ticket? It will be valid at the gate again.`;
    if (!confirm(msg)) return;
    setBusyId(row.id);
    const res = await authFetch("/api/admin/rsvps/cancel", {
      method: "POST",
      body: JSON.stringify({ code: row.id, restore: !cancel }),
    });
    setBusyId("");
    if (res.ok) load();
    else alert((await res.json().catch(() => ({})))?.error || "Couldn't update the ticket.");
  }

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
    const header = ["Ticket", "Name", "Email", "WhatsApp", "Registered", "Checked in", "Checked in at", "Checked in by", "Source", "Medium", "Campaign", "Content", "Shared by", "Form", "Cancelled", "Flags"];
    const lines = (rows ?? []).map((r) =>
      [r.id, r.name, r.email, r.whatsapp, r.createdAt, r.attended ? "yes" : "no", r.checkedInAt, r.checkedInBy, srcOf(r), r.utm_medium, r.utm_campaign, r.utm_content, r.ref ? sharerName(r.ref) : "", r.source, r.cancelled ? "yes" : "", flagsOf(r).join("; ")]
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
          <StatCard icon={<Users className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label={cancelledCount ? `Registered (${cancelledCount} cancelled)` : "Registered"} value={rows ? String(active.length) : "…"} />
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

        {bySharer.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Shared by</p>
            <div className="mt-2 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-zinc-400">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Person</th>
                    <th className="px-4 py-2.5 font-semibold">Registered</th>
                    <th className="px-4 py-2.5 font-semibold">Turned up</th>
                    {sharerPlatforms.map((pf) => (
                      <th key={pf} className="px-4 py-2.5 font-semibold">{label(pf)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {bySharer.map(([ref, t]) => {
                    const active = sharer === ref;
                    return (
                      <tr
                        key={ref || "none"}
                        onClick={() => setSharer(active ? null : ref)}
                        title={active ? "Show everyone" : `Show only registrations via ${sharerName(ref)}`}
                        className={`cursor-pointer transition-colors ${active ? "bg-brand-500/10" : "hover:bg-white/[0.03]"}`}
                      >
                        <td className={`px-4 py-2.5 font-semibold ${ref === NO_SHARER ? "text-zinc-500" : "text-white"}`}>
                          {sharerName(ref)}
                        </td>
                        <td className="px-4 py-2.5 text-lg font-bold text-white">{t.total}</td>
                        <td className="px-4 py-2.5 text-zinc-300">
                          {t.attended}
                          {t.total > 0 && <span className="ml-1 text-xs text-zinc-500">{Math.round((t.attended / t.total) * 100)}%</span>}
                        </td>
                        {sharerPlatforms.map((pf) => (
                          <td key={pf} className="px-4 py-2.5 text-zinc-300">{t.platforms.get(pf) || <span className="text-zinc-600">-</span>}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {event && <ShareLinks event={event} />}

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
            {([["all", "All"], ["in", "Checked in"], ["out", "Not yet"], ["cancelled", "Cancelled"]] as const).map(([k, label]) => (
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
                <tr key={r.id} className={r.cancelled ? "opacity-60" : ""}>
                  <td className="px-4 py-3 font-semibold text-white">
                    {r.name}
                    {flagsOf(r).map((f) => (
                      <span key={f} className="ml-2 inline-block rounded-full border border-danger/40 bg-danger/10 px-2 py-0.5 align-middle text-[10px] font-semibold text-danger">
                        {f}
                      </span>
                    ))}
                  </td>
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
                        {[r.utm_medium, r.utm_content, r.utm_campaign].filter(Boolean).join(" · ")}
                      </div>
                    )}
                    {r.ref && <div className="text-xs text-brand-500">via {sharerName(r.ref)}</div>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    {r.cancelled ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-danger px-3 py-1 text-xs font-semibold text-white">Cancelled</span>
                        <button
                          onClick={() => setCancelled(r, false)}
                          disabled={busyId === r.id}
                          className="text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-50"
                        >
                          Restore
                        </button>
                      </div>
                    ) : (
                    <div className="flex items-center gap-2">
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
                    {!r.attended && (
                      <button
                        onClick={() => setCancelled(r, true)}
                        disabled={busyId === r.id}
                        className="text-xs font-semibold text-zinc-500 hover:text-danger disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                    </div>
                    )}
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
