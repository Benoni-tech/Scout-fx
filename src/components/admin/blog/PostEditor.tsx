"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowLeft, ArrowUp, Check, CircleAlert, ExternalLink, Eye, ImagePlus, Loader2, Plus, Trash2, X,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminGate";
import RichEditor, { type EditorStats } from "@/components/admin/blog/RichEditor";
import PostContent from "@/components/blog/PostContent";
import PostCover from "@/components/blog/PostCover";
import Highlights from "@/components/blog/Highlights";
import {
  BLOG_CATEGORIES, SEO_LIMITS, categoryName, isLive, postStatusLabel, slugify,
  type ContentNode, type Faq, type Post, type PostCover as Cover, type PostSeo,
} from "@/lib/blog";
import { firstParagraph, hasInternalLink, plainText } from "@/lib/blogContent";

type Draft = {
  title: string;
  slug: string;
  category: Post["category"];
  excerpt: string;
  highlights: string[];
  cover: Cover | null;
  content: ContentNode;
  seo: PostSeo;
  faqs: Faq[];
  /** Local date-time for (scheduled) publishing, "" = now. */
  publishAt: string;
};

const SITE = "scoutsfx.com";
const AUTOSAVE_MS = 4000;

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function draftFrom(p: Post): Draft {
  return {
    title: p.title,
    slug: p.slug,
    category: p.category,
    excerpt: p.excerpt,
    highlights: p.highlights ?? [],
    cover: p.cover,
    content: p.content,
    seo: p.seo,
    faqs: p.faqs,
    publishAt: toLocalInput(p.publishedAt),
  };
}

const input =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none";

function Panel({ title, children, hint }: { title: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{title}</h2>
        {hint}
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children, counter }: { label: string; children: ReactNode; counter?: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs font-semibold text-zinc-300">
        {label}
        {counter}
      </span>
      {children}
    </label>
  );
}

function Counter({ n, max }: { n: number; max: number }) {
  const tone = n === 0 ? "text-zinc-600" : n <= max ? "text-brand-500" : "text-danger";
  return <span className={`text-[11px] font-semibold ${tone}`}>{n} / {max}</span>;
}

function KeywordInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState("");
  const add = () => {
    const words = text.split(",").map((w) => w.trim()).filter(Boolean);
    if (words.length) onChange([...new Set([...value, ...words])].slice(0, 10));
    setText("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {value.map((k) => (
          <span key={k} className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white">
            {k}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== k))} aria-label={`Remove ${k}`}>
              <X className="h-3 w-3 text-zinc-400 hover:text-white" />
            </button>
          </span>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={value.length >= 10 ? "Maximum 10 keywords" : "Type a keyword, press Enter"}
        disabled={value.length >= 10}
        className={`${input} mt-2`}
      />
    </div>
  );
}

function hasHeading(doc: ContentNode): boolean {
  return (doc.content ?? []).some((n) => n.type === "heading");
}

export default function PostEditor({ id }: { id: string }) {
  const { authFetch } = useAdmin();
  const [post, setPost] = useState<Post | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState("");
  const [stats, setStats] = useState<EditorStats>({ words: 0 });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [slugTouched, setSlugTouched] = useState(true);
  const [preview, setPreview] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(61);

  // ---------- load
  useEffect(() => {
    (async () => {
      const res = await authFetch(`/api/admin/posts/${id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setLoadError(data?.error || "Couldn't load this article.");
      const d = draftFrom(data.post);
      setPost(data.post);
      setDraft(d);
      setSaved(JSON.stringify(d));
      // A brand-new draft follows its title until the slug is edited by hand.
      setSlugTouched(data.post.status === "published" || (data.post.slug !== "untitled" && !/^untitled(-\d+)?$/.test(data.post.slug)));
    })();
  }, [authFetch, id]);

  const dirty = !!draft && JSON.stringify(draft) !== saved;
  const set = useCallback(<K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d)), []);
  const setSeo = (k: keyof PostSeo, v: PostSeo[keyof PostSeo]) => draft && set("seo", { ...draft.seo, [k]: v });

  // ---------- save
  const save = useCallback(
    async (mode: "draft" | "publish" | "update" | "unpublish" | "autosave") => {
      if (!draft || !post) return false;
      const publishing = mode === "publish" || mode === "update";
      const publishedAt = publishing
        ? draft.publishAt
          ? new Date(draft.publishAt).toISOString()
          : mode === "update" && post.publishedAt
            ? post.publishedAt
            : new Date().toISOString()
        : null;
      setState("saving");
      if (mode !== "autosave") setMessage("");
      const res = await authFetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...draft, status: publishing ? "published" : "draft", publishedAt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(data?.error || "Couldn't save.");
        return false;
      }
      const next = { ...post, ...data.post } as Post;
      const d = { ...draft, slug: next.slug, publishAt: toLocalInput(next.publishedAt) };
      setPost(next);
      setDraft(d);
      setSaved(JSON.stringify(d));
      setState("saved");
      if (mode === "publish") setMessage(isLive(next) ? "Published. It's live on the website." : "Scheduled. It goes live at the publish time.");
      if (mode === "unpublish") setMessage("Moved back to drafts. It's no longer on the website.");
      return true;
    },
    [authFetch, draft, id, post]
  );

  // autosave drafts (published articles only change when you press Update)
  useEffect(() => {
    if (!dirty || post?.status !== "draft" || !draft?.title.trim()) return;
    const t = setTimeout(() => save("autosave"), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [dirty, draft, post?.status, save]);

  // the save bar's real height (it grows when a message shows), for the pinned toolbar
  const loaded = !!draft;
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [loaded]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // ---------- uploads
  const uploadImage = useCallback(
    async (file: File) => {
      const body = new FormData();
      body.append("file", file);
      const res = await authFetch("/api/admin/uploads", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Upload failed.");
        return null;
      }
      return data as { url: string; path: string };
    },
    [authFetch]
  );

  async function pickCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    const up = await uploadImage(file);
    setUploadingCover(false);
    if (up) set("cover", { url: up.url, path: up.path, alt: draft?.cover?.alt ?? "" });
  }

  // ---------- SEO checklist
  const checks = useMemo(() => {
    if (!draft) return [];
    const kw = draft.seo.focusKeyword.trim().toLowerCase();
    const seoTitle = (draft.seo.title || draft.title).toLowerCase();
    const desc = (draft.seo.description || draft.excerpt).toLowerCase();
    const has = (s: string) => !!kw && s.includes(kw);
    return [
      { ok: !!kw, label: "Focus keyword set" },
      { ok: has(seoTitle), label: "Keyword in SEO title" },
      { ok: has(desc), label: "Keyword in meta description" },
      { ok: !!kw && draft.slug.includes(slugify(kw)), label: "Keyword in URL" },
      { ok: has(firstParagraph(draft.content).toLowerCase()), label: "Keyword in first paragraph" },
      { ok: (draft.seo.title || draft.title).length <= SEO_LIMITS.title, label: `SEO title ${SEO_LIMITS.title} characters or less` },
      { ok: desc.length >= 70 && desc.length <= SEO_LIMITS.description, label: `Description 70–${SEO_LIMITS.description} characters` },
      { ok: stats.words >= 600, label: "600+ words (yours: " + stats.words + ")" },
      { ok: hasHeading(draft.content), label: "Uses headings" },
      { ok: hasInternalLink(draft.content), label: "Links to another Scout FX page" },
      { ok: !draft.cover || !!draft.cover.alt, label: "Cover image has alt text" },
      { ok: draft.faqs.length > 0, label: "Has FAQs" },
    ];
  }, [draft, stats.words]);

  if (loadError) return <p className="p-8 text-sm text-danger">{loadError}</p>;
  if (!draft || !post) return <Loader2 className="m-8 h-6 w-6 animate-spin text-zinc-400" />;

  const status = postStatusLabel(post);
  const published = post.status === "published";
  const future = !!draft.publishAt && new Date(draft.publishAt).getTime() > Date.now();
  const seoTitle = draft.seo.title || draft.title;
  const seoDesc = draft.seo.description || draft.excerpt || plainText(draft.content).slice(0, 160);
  const passed = checks.filter((c) => c.ok).length;

  return (
    <div style={{ "--editor-bar": `${barHeight}px` } as CSSProperties}>
      {/* top bar */}
      <div ref={barRef} className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-6 py-3 backdrop-blur">
        <Link href="/admin/blog" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Articles
        </Link>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === "Published" ? "bg-brand-500 text-black" : status === "Scheduled" ? "bg-white text-black" : "border border-white/15 text-zinc-300"}`}>
          {status}
        </span>
        <span className="text-xs text-zinc-500">
          {state === "saving" ? "Saving…" : dirty ? "Unsaved changes" : state === "saved" ? "All changes saved" : ""}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button onClick={() => setPreview(true)} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">
            <Eye className="h-4 w-4" /> Preview
          </button>
          {published && isLive(post) && (
            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">
              <ExternalLink className="h-4 w-4" /> View
            </a>
          )}
          {published ? (
            <>
              <button onClick={() => confirm("Take this article off the website and move it back to drafts?") && save("unpublish")} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5">
                Unpublish
              </button>
              <button onClick={() => save("update")} disabled={state === "saving"} className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-black disabled:opacity-50">
                Update
              </button>
            </>
          ) : (
            <>
              <button onClick={() => save("draft")} disabled={state === "saving"} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50">
                Save draft
              </button>
              <button onClick={() => save("publish")} disabled={state === "saving"} className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-black disabled:opacity-50">
                {future ? "Schedule" : "Publish"}
              </button>
            </>
          )}
        </div>
        {message && (
          <p className={`w-full text-sm ${state === "error" ? "text-danger" : "text-brand-500"}`}>{message}</p>
        )}
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* writing area */}
        <div className="min-w-0">
          <textarea
            value={draft.title}
            onChange={(e) => {
              const title = e.target.value.replace(/\n/g, " ");
              setDraft((d) => (d ? { ...d, title, ...(!slugTouched ? { slug: slugify(title) || d.slug } : {}) } : d));
            }}
            rows={2}
            placeholder="Article title"
            className="w-full resize-none bg-transparent text-3xl font-bold leading-tight text-white placeholder:text-zinc-700 focus:outline-none sm:text-4xl"
          />
          {/* "Need to know" key points (shown under the title on the article) */}
          <div className="mt-4 rounded-2xl border border-white/15 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white">Need to know</p>
              <span className="text-[11px] text-zinc-500">Key points readers see after the image · up to 3</span>
            </div>
            <ul className="mt-3 space-y-2">
              {draft.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <textarea
                    value={h}
                    rows={1}
                    onChange={(e) => set("highlights", draft.highlights.map((x, j) => (j === i ? e.target.value.replace(/\n/g, " ").slice(0, 220) : x)))}
                    placeholder="One short, factual point"
                    className={`${input} resize-none`}
                  />
                  <button type="button" onClick={() => set("highlights", draft.highlights.filter((_, j) => j !== i))} className="mt-2 rounded p-1 text-zinc-500 hover:text-danger" aria-label="Remove point">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            {draft.highlights.length < 3 && (
              <button type="button" onClick={() => set("highlights", [...draft.highlights, ""])} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:underline">
                <Plus className="h-3.5 w-3.5" /> Add a key point
              </button>
            )}
          </div>

          <div className="mt-4">
            <RichEditor initial={post.content} onChange={(doc, s) => { set("content", doc); setStats(s); }} uploadImage={async (f) => (await uploadImage(f))?.url ?? null} />
          </div>
          <p className="mt-2 text-xs text-zinc-500">{stats.words} words · about {Math.max(1, Math.round(stats.words / 220))} min read</p>
          <div className="mt-6">
          <Panel title="SEO" hint={<span className="text-[11px] font-semibold text-zinc-500">{passed}/{checks.length} checks</span>}>
            {/* Google preview */}
            <div className="rounded-xl bg-white p-3">
              <p className="truncate text-[11px] text-zinc-600">{SITE} › blog › {draft.slug}</p>
              <p className="mt-0.5 line-clamp-1 text-[15px] font-medium text-[#1a0dab]">{seoTitle.length > 60 ? seoTitle.slice(0, 60) + "…" : seoTitle || "Article title"}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-zinc-700">{seoDesc.length > 160 ? seoDesc.slice(0, 160) + "…" : seoDesc || "Meta description"}</p>
            </div>
            <Field label="SEO title" counter={<Counter n={(draft.seo.title || draft.title).length} max={SEO_LIMITS.title} />}>
              <input value={draft.seo.title} onChange={(e) => setSeo("title", e.target.value)} placeholder={draft.title} className={input} />
            </Field>
            <Field label="Meta description" counter={<Counter n={draft.seo.description.length} max={SEO_LIMITS.description} />}>
              <textarea value={draft.seo.description} onChange={(e) => setSeo("description", e.target.value)} rows={3} placeholder="What the reader gets from this article, with the focus keyword." className={input} />
            </Field>
            <Field label="Focus keyword">
              <input value={draft.seo.focusKeyword} onChange={(e) => setSeo("focusKeyword", e.target.value)} placeholder="e.g. forex trading in Ghana" className={input} />
            </Field>
            <Field label="Other keywords">
              <KeywordInput value={draft.seo.keywords} onChange={(v) => setSeo("keywords", v)} />
            </Field>
            <ul className="space-y-1.5 border-t border-white/10 pt-3">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center gap-2 text-xs">
                  {c.ok ? <Check className="h-3.5 w-3.5 shrink-0 text-brand-500" /> : <CircleAlert className="h-3.5 w-3.5 shrink-0 text-zinc-600" />}
                  <span className={c.ok ? "text-zinc-300" : "text-zinc-500"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </Panel>
          </div>
        </div>

        {/* settings */}
        <div className="space-y-4">
          <Panel title="Publish">
            <Field label="Publish date and time">
              <input type="datetime-local" value={draft.publishAt} onChange={(e) => set("publishAt", e.target.value)} className={input} />
            </Field>
            <p className="text-xs text-zinc-500">
              {draft.publishAt
                ? future
                  ? "In the future: the article goes live automatically at this time."
                  : "Shown as the article's date."
                : "Leave empty to publish now."}
            </p>
          </Panel>

          <Panel title="URL">
            <Field label="Slug">
              <input
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
                }}
                className={input}
              />
            </Field>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs text-zinc-500">{SITE}/blog/{draft.slug}</p>
              <button type="button" onClick={() => { set("slug", slugify(draft.title) || draft.slug); setSlugTouched(true); }} className="shrink-0 text-xs font-semibold text-brand-500 hover:underline">
                From title
              </button>
            </div>
            {published && draft.slug !== post.slug && (
              <p className="text-xs text-zinc-400">Changing a live URL is fine: the old link will redirect to the new one.</p>
            )}
          </Panel>

          <Panel title="Category and summary">
            <Field label="Category">
              <select value={draft.category} onChange={(e) => set("category", e.target.value as Post["category"])} className={input}>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Excerpt (shown on cards and under the title)" counter={<Counter n={draft.excerpt.length} max={300} />}>
              <textarea value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value.slice(0, 300))} rows={3} className={input} placeholder="One or two sentences on what the reader will learn." />
            </Field>
          </Panel>

          <Panel title="Cover image">
            <PostCover seed={draft.slug} category={draft.category} image={draft.cover} className="aspect-[16/9] rounded-xl border border-white/10" sizes="360px" />
            {!draft.cover && <p className="text-xs text-zinc-500">No image: the branded cover above is used.</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => coverRef.current?.click()} disabled={uploadingCover} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-50">
                {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                {draft.cover ? "Replace" : "Upload image"}
              </button>
              {draft.cover && (
                <button type="button" onClick={() => set("cover", null)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-danger">
                  Remove
                </button>
              )}
            </div>
            {draft.cover && (
              <Field label="Alt text (describe the image)">
                <input value={draft.cover.alt} onChange={(e) => set("cover", { ...draft.cover!, alt: e.target.value })} className={input} />
              </Field>
            )}
            <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pickCover} />
            <p className="text-[11px] text-zinc-600">JPG, PNG or WebP, up to 3 MB. Landscape 1200×675 works best.</p>
          </Panel>


          <Panel title="FAQs" hint={<span className="text-[11px] text-zinc-500">Shown on the page and to Google</span>}>
            {draft.faqs.map((f, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-white/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Question {i + 1}</span>
                  <span className="flex gap-1">
                    <button type="button" disabled={i === 0} onClick={() => { const a = [...draft.faqs]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set("faqs", a); }} className="rounded p-1 text-zinc-500 hover:text-white disabled:opacity-30" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={i === draft.faqs.length - 1} onClick={() => { const a = [...draft.faqs]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; set("faqs", a); }} className="rounded p-1 text-zinc-500 hover:text-white disabled:opacity-30" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => set("faqs", draft.faqs.filter((_, j) => j !== i))} className="rounded p-1 text-zinc-500 hover:text-danger" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                  </span>
                </div>
                <input value={f.q} onChange={(e) => set("faqs", draft.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} placeholder="Question" className={input} />
                <textarea value={f.a} onChange={(e) => set("faqs", draft.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} rows={3} placeholder="Answer" className={input} />
              </div>
            ))}
            <button type="button" disabled={draft.faqs.length >= 20} onClick={() => set("faqs", [...draft.faqs, { q: "", a: "" }])} className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:underline disabled:opacity-40">
              <Plus className="h-3.5 w-3.5" /> Add question
            </button>
          </Panel>

          <Panel title="Advanced">
            <Field label="Canonical URL (only if first published elsewhere)">
              <input value={draft.seo.canonical} onChange={(e) => setSeo("canonical", e.target.value)} placeholder="https://…" className={input} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={draft.seo.noindex} onChange={(e) => setSeo("noindex", e.target.checked)} className="accent-[#FBFE00]" />
              Hide from Google (noindex)
            </label>
          </Panel>
        </div>
      </div>

      {/* preview */}
      {preview && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/95 backdrop-blur">
          <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-3">
            <span className="text-sm font-semibold text-white">Preview · {categoryName(draft.category)}</span>
            <button onClick={() => setPreview(false)} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white hover:bg-white/5">
              <X className="h-4 w-4" /> Close
            </button>
          </div>
          <article className="mx-auto max-w-2xl px-6 py-12">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{draft.title}</h1>
            <p className="mt-4 text-sm text-zinc-400">By <span className="font-semibold text-white">Coach Emma</span></p>
            <PostCover seed={draft.slug} category={draft.category} image={draft.cover} className="mt-6 aspect-[16/9] rounded-3xl border border-white/10" sizes="672px" />
            <Highlights items={draft.highlights} />
            {draft.excerpt && <p className="mt-8 text-lg font-semibold text-zinc-200">{draft.excerpt}</p>}
            <div className="mt-10">
              <PostContent doc={draft.content} />
            </div>
            {draft.faqs.filter((f) => f.q && f.a).length > 0 && (
              <div className="mt-12 space-y-4">
                <h2 className="text-2xl font-bold text-white">Questions</h2>
                {draft.faqs.filter((f) => f.q && f.a).map((f, i) => (
                  <div key={i} className="border-b border-white/10 pb-4">
                    <p className="font-semibold text-white">{f.q}</p>
                    <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
