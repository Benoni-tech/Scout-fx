"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, ImagePlus, Loader2, Search, Trash2, UploadCloud } from "lucide-react";
import { useMediaLibrary } from "@/components/admin/media/useMediaLibrary";
import { MEDIA_LIMITS, captionLine, type MediaItem, type MediaUsage } from "@/lib/mediaTypes";

export type PickedImage = { url: string; path: string; alt: string; caption: string; credit: string };

const input =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none";

function kb(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/**
 * The media library: upload (drag and drop or browse), search and a details panel.
 * "manage" (Admin → Media) edits the library itself; "pick" (inside the article
 * editor) fills in alt/caption/credit for one article and hands the image back.
 */
export default function MediaBrowser({
  mode,
  onPick,
  pickLabel = "Insert image",
}: {
  mode: "manage" | "pick";
  onPick?: (img: PickedImage) => void;
  pickLabel?: string;
}) {
  const lib = useMediaLibrary();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fields, setFields] = useState({ alt: "", caption: "", credit: "" });
  const [progress, setProgress] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [usedIn, setUsedIn] = useState<MediaUsage[] | null>(null);
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = lib.items?.find((m) => m.id === selectedId) ?? null;

  // load the selected image's details (and, in manage mode, where it's used)
  useEffect(() => {
    if (!selected) return;
    setFields({ alt: selected.alt, caption: selected.caption, credit: selected.credit });
    setStatus("");
    setUsedIn(null);
    if (mode === "manage") lib.usage(selected.id).then(setUsedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (lib.items ?? []).filter((m) => !q || [m.filename, m.alt, m.caption, m.credit].some((f) => f.toLowerCase().includes(q)));
  }, [lib.items, query]);

  async function upload(files: File[]) {
    if (!files.length) return;
    setErrors([]);
    const { added, errors } = await lib.upload(files, (done, total) =>
      setProgress(done < total ? `Uploading ${done + 1} of ${total}…` : "")
    );
    setErrors(errors);
    if (added[0]) setSelectedId(added[added.length - 1].id);
  }

  async function save() {
    if (!selected) return;
    setStatus(await lib.save(selected.id, fields) ? "Saved to the library." : "Couldn't save.");
  }

  async function remove() {
    if (!selected || !confirm("Delete this image from the library? This can't be undone.")) return;
    const r = await lib.remove(selected.id);
    if (r === null) setSelectedId(null);
    else if (r === "error") setStatus("Couldn't delete.");
    else {
      setUsedIn(r);
      setStatus("Not deleted: this image is used in the articles below. Remove it from them first.");
    }
  }

  return (
    <div
      className="relative grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        upload([...e.dataTransfer.files]);
      }}
    >
      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-3xl border-2 border-dashed border-brand-500 bg-black/80">
          <p className="flex items-center gap-2 text-lg font-bold text-brand-500">
            <UploadCloud className="h-6 w-6" /> Drop images to upload
          </p>
        </div>
      )}

      {/* library */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, alt text, caption" className={`${input} rounded-full pl-9`} />
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={!!progress}
            className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {progress ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {progress || "Upload images"}
          </button>
          <span className="text-xs text-zinc-500">or drag and drop · JPG, PNG, WebP · resized and optimised automatically</span>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              upload([...(e.target.files ?? [])]);
              e.target.value = "";
            }}
          />
        </div>
        {errors.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-danger">
            {errors.map((er) => (
              <li key={er}>{er}</li>
            ))}
          </ul>
        )}
        {lib.error && <p className="mt-3 text-sm text-danger">{lib.error}</p>}

        <div className="mt-5">
          {lib.items === null ? (
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          ) : visible.length === 0 ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-3xl border border-dashed border-white/15 py-16 text-zinc-400 hover:border-brand-500/50"
            >
              <UploadCloud className="h-8 w-8 text-brand-500" />
              {lib.items.length ? "No images match your search." : "No images yet. Upload your first one."}
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6">
              {visible.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedId(m.id)}
                  title={m.filename}
                  className={`group relative aspect-square overflow-hidden rounded-xl border-2 bg-zinc-900 ${
                    selectedId === m.id ? "border-brand-500" : "border-transparent hover:border-white/30"
                  }`}
                >
                  <Image src={m.url} alt={m.alt} fill sizes="160px" className="object-cover" />
                  {selectedId === m.id && (
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-black">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  {!m.alt && <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-zinc-300">no alt</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* details */}
      <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-4 lg:sticky lg:top-4">
        {!selected ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            {mode === "pick" ? "Choose an image, or upload a new one." : "Select an image to see and edit its details."}
          </p>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black">
              <Image src={selected.url} alt={selected.alt} fill sizes="340px" className="object-contain" />
            </div>
            <div className="text-xs text-zinc-500">
              <p className="truncate font-semibold text-zinc-300" title={selected.filename}>{selected.filename}</p>
              <p>
                {selected.width} × {selected.height} · {kb(selected.bytes)} · {new Date(selected.uploadedAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-zinc-300">Alt text (describe the image)</span>
              <input value={fields.alt} maxLength={MEDIA_LIMITS.alt} onChange={(e) => setFields({ ...fields, alt: e.target.value })} className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-zinc-300">Caption (shown under the image)</span>
              <textarea value={fields.caption} maxLength={MEDIA_LIMITS.caption} rows={2} onChange={(e) => setFields({ ...fields, caption: e.target.value })} className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-zinc-300">Photo credit</span>
              <input value={fields.credit} maxLength={MEDIA_LIMITS.credit} onChange={(e) => setFields({ ...fields, credit: e.target.value })} placeholder="e.g. Scout FX" className={input} />
            </label>
            {captionLine(fields.caption, fields.credit) && (
              <p className="rounded-lg bg-black/40 p-2 text-xs text-zinc-400">
                <span className="text-zinc-600">Shows as: </span>
                {captionLine(fields.caption, fields.credit)}
              </p>
            )}

            {mode === "pick" ? (
              <>
                <p className="text-[11px] text-zinc-500">These details are used in this article. The library copy stays as it is.</p>
                <button
                  type="button"
                  disabled={!fields.alt.trim()}
                  onClick={() => onPick?.({ url: selected.url, path: selected.path, alt: fields.alt.trim(), caption: fields.caption.trim(), credit: fields.credit.trim() })}
                  className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-40"
                >
                  {fields.alt.trim() ? pickLabel : "Add alt text to continue"}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={save} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-black">
                    Save details
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(selected.url).then(() => setStatus("Link copied."))}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <Copy className="h-4 w-4" /> Copy link
                  </button>
                  <button type="button" onClick={remove} className="ml-auto rounded-full p-2 text-zinc-500 hover:bg-danger/10 hover:text-danger" title="Delete image">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">Changes apply to new insertions. Articles already using this image keep their own text.</p>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs font-semibold text-zinc-300">Used in</p>
                  {usedIn === null ? (
                    <Loader2 className="mt-2 h-4 w-4 animate-spin text-zinc-500" />
                  ) : usedIn.length === 0 ? (
                    <p className="mt-1 text-xs text-zinc-500">Not used in any article.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {usedIn.map((u) => (
                        <li key={u.postId + u.as} className="text-xs">
                          <Link href={`/admin/blog/${u.postId}`} className="text-brand-500 hover:underline">{u.title}</Link>
                          <span className="text-zinc-500"> · {u.as === "cover" ? "featured image" : "in article"}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
            {status && <p className="text-xs text-brand-500">{status}</p>}
          </div>
        )}
      </aside>
    </div>
  );
}
