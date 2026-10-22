"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminGate";
import { shrinkImage } from "@/lib/shrinkImage";
import type { MediaItem, MediaUsage } from "@/lib/mediaTypes";

/** Loads the media library and wraps its API calls. */
export function useMediaLibrary() {
  const { authFetch } = useAdmin();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const res = await authFetch("/api/admin/media");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || "Couldn't load the media library.");
      return setItems([]);
    }
    setItems(data.media);
  }, [authFetch]);

  useEffect(() => {
    reload();
  }, [reload]);

  /** Uploads files one by one; returns the new items and any per-file errors. */
  const upload = useCallback(
    async (files: File[], onProgress?: (done: number, total: number) => void) => {
      const added: MediaItem[] = [];
      const errors: string[] = [];
      for (const [i, f] of files.entries()) {
        onProgress?.(i, files.length);
        try {
          const body = new FormData();
          body.append("file", await shrinkImage(f));
          const res = await authFetch("/api/admin/media", { method: "POST", body });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(`${f.name}: ${data?.error || "upload failed"}`);
          added.push(data.item);
        } catch (e) {
          errors.push(e instanceof Error ? e.message : `${f.name}: upload failed`);
        }
      }
      onProgress?.(files.length, files.length);
      if (added.length) setItems((cur) => [...added.reverse(), ...(cur ?? [])]);
      return { added, errors };
    },
    [authFetch]
  );

  const save = useCallback(
    async (id: string, fields: Pick<MediaItem, "alt" | "caption" | "credit">) => {
      const res = await authFetch(`/api/admin/media/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
      if (res.ok) setItems((cur) => cur?.map((m) => (m.id === id ? { ...m, ...fields } : m)) ?? cur);
      return res.ok;
    },
    [authFetch]
  );

  const usage = useCallback(
    async (id: string): Promise<MediaUsage[]> => {
      const res = await authFetch(`/api/admin/media/${id}`);
      return res.ok ? (await res.json()).usedIn : [];
    },
    [authFetch]
  );

  /** Returns null when deleted, or the articles that still use it. */
  const remove = useCallback(
    async (id: string): Promise<MediaUsage[] | null | "error"> => {
      const res = await authFetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((cur) => cur?.filter((m) => m.id !== id) ?? cur);
        return null;
      }
      if (res.status === 409) return (await res.json()).usedIn as MediaUsage[];
      return "error";
    },
    [authFetch]
  );

  return { items, error, reload, upload, save, usage, remove };
}
