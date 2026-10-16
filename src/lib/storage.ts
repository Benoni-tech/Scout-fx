import { randomUUID } from "crypto";
import { getAdminBucket } from "@/lib/firebaseAdmin";

// Blog images in Firebase Storage. Files get a random download token, so the URL
// works publicly while the bucket itself stays closed to browsers (Storage rules
// can deny everything; the Admin SDK and token links aren't affected).

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/** Checks the real file signature, not just what the browser claims. */
export function sniffImage(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export class StorageNotEnabledError extends Error {}

export async function uploadBlogImage(buf: Buffer, contentType: string) {
  const bucket = getAdminBucket();
  const [exists] = await bucket.exists().catch(() => [false]);
  if (!exists) throw new StorageNotEnabledError("Firebase Storage isn't enabled for this project yet.");

  const path = `blog/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${IMAGE_TYPES[contentType]}`;
  const token = randomUUID();
  await bucket.file(path).save(buf, {
    resumable: false,
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  return { url, path };
}
