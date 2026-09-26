"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  Sprout,
  Users,
  Wallet,
} from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";
import { EDUCATION_LEVELS, SEED_PROGRAM, SEED_STATUSES, type SeedStatus } from "@/lib/seedProgram";

type Row = {
  id: string;
  ref: string;
  name: string;
  email: string;
  whatsapp: string;
  dob: string;
  location: string;
  education?: string;
  experience: string;
  hasHfmAccount: string;
  hasBinanceAccount?: string;
  hasMt5Account?: string;
  motivation: string;
  termsVersion: string;
  termsAcceptedAt: string;
  status: SeedStatus | "new";
  seedAmount?: number;
  note?: string;
  statusUpdatedBy?: string;
  createdAt: string;
};

const EXPERIENCE: Record<string, string> = {
  none: "Never traded",
  beginner: "Tried a little",
  some: "Trades sometimes",
};

const STATUS_STYLE: Record<string, string> = {
  registered: "border-white/15 text-zinc-300",
  in_training: "border-sky-400/40 text-sky-300",
  training_complete: "border-brand-500/40 text-brand-500",
  seed_awarded: "border-brand-500 bg-brand-500 text-black",
  seed_not_awarded: "border-white/10 text-zinc-500",
};

const eduLabel = (v?: string) => EDUCATION_LEVELS.find((l) => l.value === v)?.label ?? "";

const statusLabel = (s: string) =>
  SEED_STATUSES.find((x) => x.value === s)?.label ?? "Registered";

function age(dob: string) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a--;
  return String(a);
}

function fmt(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function csvCell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AdminSeedPage() {
  const { authFetch } = useAdmin();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [busyId, setBusyId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await authFetch("/api/admin/applications");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't load registrations.");
      setRows(data.applications);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load registrations.");
      setRows([]);
    }
  }, [authFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const norm = (r: Row) => (r.status === "new" ? "registered" : r.status);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (filter !== "all" && norm(r) !== filter) return false;
      if (!q) return true;
      return [r.name, r.email, r.whatsapp, r.ref, r.location].some((f) => f?.toLowerCase().includes(q));
    });
  }, [rows, query, filter]);

  const count = (s: string) => rows?.filter((r) => norm(r) === s).length ?? 0;
  const awardedTotal = rows?.reduce((t, r) => t + (norm(r) === "seed_awarded" ? r.seedAmount ?? 0 : 0), 0) ?? 0;

  async function update(row: Row, status: SeedStatus, note?: string) {
    let seedAmount: number | undefined = row.seedAmount;
    if (status === "seed_awarded" && norm(row) !== "seed_awarded") {
      const input = prompt(
        `Seed amount for ${row.name} (1–${SEED_PROGRAM.seedAmount} USD):`,
        String(row.seedAmount ?? SEED_PROGRAM.seedAmount)
      );
      if (input === null) return;
      seedAmount = Number(input);
    }
    setBusyId(row.id);
    const res = await authFetch("/api/admin/applications", {
      method: "PATCH",
      body: JSON.stringify({ id: row.id, status, seedAmount, note }),
    });
    setBusyId("");
    if (!res.ok) {
      alert((await res.json().catch(() => ({})))?.error || "Update failed.");
      return;
    }
    load();
  }

  function exportCsv() {
    const header = ["Ref", "Name", "Email", "WhatsApp", "Age", "Location", "Education", "Experience", "HFM account", "Binance account", "MT5 account", "Status", "Seed amount", "Registered", "Terms version", "Why join", "Note"];
    const lines = (rows ?? []).map((r) =>
      [r.ref, r.name, r.email, r.whatsapp, age(r.dob), r.location, eduLabel(r.education), EXPERIENCE[r.experience] ?? r.experience, r.hasHfmAccount, r.hasBinanceAccount ?? "", r.hasMt5Account ?? "", statusLabel(norm(r)), r.seedAmount ?? "", r.createdAt, r.termsVersion, r.motivation, r.note ?? ""]
        .map(csvCell)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "seed-program-registrations.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="py-8">
      <Container className="max-w-none px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{SEED_PROGRAM.name}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Seed registrations</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Everyone registered gets training. Move people through the stages and decide on seed capital at the end.
            </p>
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

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Registered" value={rows ? String(rows.length) : "…"} />
          <StatCard icon={<GraduationCap className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label="In training" value={rows ? String(count("in_training")) : "…"} />
          <StatCard icon={<Sprout className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label="Training complete" value={rows ? String(count("training_complete")) : "…"} />
          <StatCard icon={<Wallet className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label={`Seed awarded · $${awardedTotal}`} value={rows ? String(count("seed_awarded")) : "…"} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, ref"
              className="w-full rounded-full border border-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {[{ value: "all", label: "All" }, ...SEED_STATUSES].map((s) => (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  filter === s.value ? "bg-white text-black" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Profile</th>
                <th className="px-4 py-3 font-semibold">Registered</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="w-10 px-2 py-3" />
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
              {visible.map((r) => {
                const st = norm(r);
                const isOpen = open === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr className={isOpen ? "bg-white/[0.02]" : undefined}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{r.name}</p>
                        <p className="font-mono text-[11px] tracking-wider text-zinc-500">{r.ref}</p>
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
                      <td className="px-4 py-3 text-zinc-400">
                        <div>
                          {age(r.dob)} yrs · {r.location}
                        </div>
                        <div className="text-xs">
                          {eduLabel(r.education)}
                          {r.education ? " · " : ""}
                          {EXPERIENCE[r.experience] ?? r.experience}
                        </div>
                        <div className="text-xs">
                          HFM: {r.hasHfmAccount} · Binance: {r.hasBinanceAccount ?? "-"} · MT5: {r.hasMt5Account ?? "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{fmt(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="relative inline-flex items-center">
                          <select
                            value={st}
                            disabled={busyId === r.id}
                            onChange={(e) => update(r, e.target.value as SeedStatus)}
                            className={`appearance-none rounded-full border py-1.5 pl-3 pr-8 text-xs font-semibold outline-none disabled:opacity-50 ${STATUS_STYLE[st]}`}
                          >
                            {SEED_STATUSES.map((s) => (
                              <option key={s.value} value={s.value} className="bg-zinc-900 text-white">
                                {s.label}
                                {s.value === "seed_awarded" && st === "seed_awarded" && r.seedAmount ? ` · $${r.seedAmount}` : ""}
                              </option>
                            ))}
                          </select>
                          {busyId === r.id ? (
                            <Loader2 className="pointer-events-none absolute right-2.5 h-3 w-3 animate-spin" />
                          ) : (
                            <ChevronDown className="pointer-events-none absolute right-2.5 h-3 w-3 opacity-70" />
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          aria-label={isOpen ? "Hide details" : "Show details"}
                          onClick={() => setOpen(isOpen ? null : r.id)}
                          className="rounded-full p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-white/[0.02]">
                        <td colSpan={6} className="px-4 pb-5 pt-1">
                          <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Why they want to join</p>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{r.motivation}</p>
                              <p className="mt-4 text-xs text-zinc-500">
                                Accepted terms v{r.termsVersion} on {fmt(r.termsAcceptedAt)}
                                {r.statusUpdatedBy ? ` · last updated by ${r.statusUpdatedBy}` : ""}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Internal note</p>
                              <textarea
                                rows={3}
                                value={notes[r.id] ?? r.note ?? ""}
                                onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                                placeholder="Attendance, assessment result, anything the team should know"
                                className="mt-2 w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500"
                              />
                              <button
                                onClick={() => update(r, st, notes[r.id] ?? r.note ?? "")}
                                disabled={busyId === r.id || (notes[r.id] ?? r.note ?? "") === (r.note ?? "")}
                                className="mt-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black disabled:opacity-40"
                              >
                                Save note
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
