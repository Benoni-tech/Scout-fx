// Media library types and limits, shared by the admin UI and the API.

export type MediaItem = {
  id: string;
  url: string;
  /** Path inside the Storage bucket. */
  path: string;
  /** Original file name, for searching. */
  filename: string;
  alt: string;
  caption: string;
  /** Photo credit, shown as "Photo: …". */
  credit: string;
  width: number;
  height: number;
  bytes: number;
  uploadedAt: string;
  uploadedBy: string;
};

/** Where a media item is used. */
export type MediaUsage = { postId: string; title: string; slug: string; as: "cover" | "body" };

export const MEDIA_LIMITS = {
  /** What the browser accepts before shrinking it. */
  pickMaxBytes: 25 * 1024 * 1024,
  /** What the server accepts after the browser shrank it. */
  uploadMaxBytes: 4 * 1024 * 1024,
  /** Longest side after resizing. */
  maxSide: 2000,
  alt: 200,
  caption: 300,
  credit: 120,
};

/** The caption line under an image: "Caption. Photo: Credit". */
export function captionLine(caption?: string | null, credit?: string | null) {
  const c = (caption ?? "").trim();
  const p = (credit ?? "").trim();
  if (!c && !p) return "";
  return [c, p ? `Photo: ${p}` : ""].filter(Boolean).join(c && !/[.!?]$/.test(c) ? ". " : " ");
}
