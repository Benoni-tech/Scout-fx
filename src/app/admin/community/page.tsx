"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Download, Loader2, RefreshCw, Search, Users } from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";

type Lead = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  source: string;
  createdAt: string;
};

function fmt(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function csvCell(v: unknown) {
  let s = String(v ?? "");
  // Stop spreadsheet apps treating user-entered text as a formula.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AdminCommunityPage() {
  const { authFetch } = useAdmin();
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await authFetch("/api/admin/leads");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't load the community list.");
      setRows(data.leads);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load the community list.");
      setRows([]);
    }
  }, [authFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) =>
      !q ? true : [r.name, r.email, r.whatsapp, r.source].some((f) => f?.toLowerCase().includes(q))
    );
  }, [rows, query]);

  const last7 = rows?.filter((r) => Date.now() - Date.parse(r.createdAt) < 7 * 864e5).length ?? 0;

  function exportCsv() {
    const header = ["Name", "Email", "WhatsApp", "Joined", "Source"];
    const lines = (rows ?? []).map((r) =>
      [r.name, r.email, r.whatsapp, r.createdAt, r.source].map(csvCell).join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "community-members.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="py-8">
      <Container className="max-w-none px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Community</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Community members</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Everyone who joined through the &ldquo;Join free&rdquo; form.
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

        <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
          <StatCard
            icon={<Users className="h-4 w-4 text-black" />}
            iconBg="bg-brand-600"
            label="Members"
            value={rows ? String(rows.length) : "…"}
          />
          <StatCard
            icon={<CalendarPlus className="h-4 w-4 text-brand-500" />}
            iconBg="bg-brand-500/10"
            label="Joined last 7 days"
            value={rows ? String(last7) : "…"}
          />
        </div>

        <div className="relative mt-6 w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone"
            className="w-full rounded-full border border-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500"
          />
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows === null && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-400" />
                  </td>
                </tr>
              )}
              {rows && visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-zinc-400">
                    {rows.length ? "No matches." : "No community members yet."}
                  </td>
                </tr>
              )}
              {visible.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-semibold text-white">{r.name || "-"}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    <div>{r.email}</div>
                    <a
                      href={`https://wa.me/${(r.whatsapp || "").replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:underline"
                    >
                      {r.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
