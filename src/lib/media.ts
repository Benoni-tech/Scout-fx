import { randomUUID } from "crypto";
import sharp from "sharp";
import { getAdminBucket, getAdminDb } from "@/lib/firebaseAdmin";
import { MEDIA_LIMITS, type MediaItem, type MediaUsage } from "@/lib/mediaTypes";
import { sniffImage, StorageNotEnabledError } from "@/lib/storage";
import type { ContentNode, Post } from "@/lib/blog";

// The blog's media library: image files in Firebase Storage ("blog/…"), one
// Firestore document per image ("media/{id}") with its alt text, caption and credit.

const MEDIA = () => getAdminDb().collection("media");

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

/**
 * Resizes to at most 2000px, converts to WebP and drops all metadata
 * (EXIF, including any GPS location from a phone photo).
 */
async function optimise(buf: Buffer) {
  const { data, info } = await sharp(buf, { failOn: "error" })
    .rotate() // apply the phone's orientation before metadata is dropped
    .resize({ width: MEDIA_LIMITS.maxSide, height: MEDIA_LIMITS.maxSide, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

export async function addMedia(buf: Buffer, filename: string, by: string, meta: { alt?: unknown; caption?: unknown; credit?: unknown } = {}) {
  if (!sniffImage(buf)) throw new Error("Only JPG, PNG or WebP images can be uploaded.");
  const bucket = getAdminBucket();
  const [exists] = await bucket.exists().catch(() => [false]);
  if (!exists) throw new StorageNotEnabledError("Firebase Storage isn't enabled for this project yet.");

  const { data, width, height } = await optimise(buf);
  const path = `blog/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.webp`;
  const token = randomUUID();
  await bucket.file(path).save(data, {
    resumable: false,
    contentType: "image/webp",
    metadata: { cacheControl: "public, max-age=31536000, immutable", metadata: { firebaseStorageDownloadTokens: token } },
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;

  const ref = MEDIA().doc();
  const item: Omit<MediaItem, "id"> = {
    url,
    path,
    filename: clean(filename, 120) || "image",
    alt: clean(meta.alt, MEDIA_LIMITS.alt),
    caption: clean(meta.caption, MEDIA_LIMITS.caption),
    credit: clean(meta.credit, MEDIA_LIMITS.credit),
    width,
    height,
    bytes: data.length,
    uploadedAt: new Date().toISOString(),
    uploadedBy: by,
  };
  await ref.create(item);
  return { id: ref.id, ...item };
}

export async function listMedia(): Promise<MediaItem[]> {
  const snap = await MEDIA().orderBy("uploadedAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MediaItem, "id">) }));
}

export async function updateMedia(id: string, body: Record<string, unknown>) {
  const ref = MEDIA().doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.update({
    alt: clean(body.alt, MEDIA_LIMITS.alt),
    caption: clean(body.caption, MEDIA_LIMITS.caption),
    credit: clean(body.credit, MEDIA_LIMITS.credit),
  });
  return true;
}

function bodyUses(node: ContentNode | undefined, url: string): boolean {
  if (!node) return false;
  if (node.type === "image" && node.attrs?.src === url) return true;
  return (node.content ?? []).some((c) => bodyUses(c, url));
}

/** Every article (draft or published) using this image, as cover or in the body. */
export async function mediaUsage(url: string): Promise<MediaUsage[]> {
  const posts = await getAdminDb().collection("posts").get();
  const out: MediaUsage[] = [];
  for (const d of posts.docs) {
    const p = d.data() as Post;
    if (p.cover?.url === url) out.push({ postId: d.id, title: p.title, slug: p.slug, as: "cover" });
    if (bodyUses(p.content, url)) out.push({ postId: d.id, title: p.title, slug: p.slug, as: "body" });
  }
  return out;
}

/** Deletes the file and its record, unless an article still uses it. */
export async function deleteMedia(id: string): Promise<{ ok: true } | { usedIn: MediaUsage[] } | { notFound: true }> {
  const ref = MEDIA().doc(id);
  const doc = await ref.get();
  if (!doc.exists) return { notFound: true };
  const item = doc.data() as MediaItem;
  const usedIn = await mediaUsage(item.url);
  if (usedIn.length) return { usedIn };
  await getAdminBucket().file(item.path).delete({ ignoreNotFound: true });
  await ref.delete();
  return { ok: true };
}
