"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminGate";
import { BLOG_CATEGORIES, categoryName, isLive, postStatusLabel, type Post } from "@/lib/blog";

type Row = Omit<Post, "content" | "faqs">;

const STATUS_STYLE: Record<string, string> = {
  Published: "bg-brand-500 text-black",
  Scheduled: "bg-white text-black",
  Draft: "border border-white/15 text-zinc-300",
};

function when(iso?: string | null) {
  return iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";
}

export default function AdminBlogPage() {
  const { authFetch } = useAdmin();
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "Published" | "Scheduled" | "Draft">("all");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setError("");
    const res = await authFetch("/api/admin/posts");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || "Couldn't load posts.");
      return setRows([]);
    }
    setRows(data.posts);
  }, [authFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (status === "all" || postStatusLabel(r) === status) &&
        (!category || r.category === category) &&
        (!q || [r.title, r.slug, r.seo?.focusKeyword].some((f) => f?.toLowerCase().includes(q)))
    );
  }, [rows, query, status, category]);

  const count = (s: string) => rows?.filter((r) => postStatusLabel(r) === s).length ?? 0;

  async function newPost() {
    setBusy("new");
    const res = await authFetch("/api/admin/posts", { method: "POST", body: JSON.stringify({ title: "", category: category || "start-here" }) });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) return alert(data?.error || "Couldn't create a post.");
    router.push(`/admin/blog/${data.id}`);
  }

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.title}" permanently? ${isLive(r) ? "It will disappear from the website and its link will stop working. " : ""}This can't be undone.`)) return;
    setBusy(r.id);
    const res = await authFetch(`/api/admin/posts/${r.id}`, { method: "DELETE" });
    setBusy("");
    if (!res.ok) return alert("Couldn't delete the post.");
    load();
  }

  return (
    <section className="py-8">
      <div className="px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Blog</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Articles</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {count("Published")} published · {count("Scheduled")} scheduled · {count("Draft")} drafts
            </p>
          </div>
          <button
            onClick={newPost}
            disabled={busy === "new"}
            className="flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          >
            {busy === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} New article
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, URL, keyword"
              className="w-full rounded-full border border-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "Published", "Scheduled", "Draft"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${status === s ? "bg-white text-black" : "text-zinc-300 hover:bg-white/5"}`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-white/10 bg-black px-3 py-2 text-sm text-white"
          >
            <option value="">All categories</option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Words</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold" />
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
                    {rows.length ? "No matches." : "No articles yet. Click New article to write the first one."}
                  </td>
                </tr>
              )}
              {visible.map((r) => {
                const label = postStatusLabel(r);
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/blog/${r.id}`} className="font-semibold text-white hover:text-brand-500">
                        {r.title}
                      </Link>
                      <div className="text-xs text-zinc-500">/blog/{r.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[label]}`}>{label}</span>
                      {label === "Scheduled" && <div className="mt-1 text-xs text-zinc-500">{when(r.publishedAt)}</div>}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{categoryName(r.category)}</td>
                    <td className="px-4 py-3 text-zinc-400">{r.wordCount}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {when(r.updatedAt)}
                      <div className="text-xs text-zinc-600">{r.updatedBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/blog/${r.id}`} title="Edit" className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        {isLive(r) && (
                          <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer" title="View on website" className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button onClick={() => remove(r)} disabled={busy === r.id} title="Delete" className="rounded-full p-2 text-zinc-500 hover:bg-danger/10 hover:text-danger disabled:opacity-50">
                          {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
