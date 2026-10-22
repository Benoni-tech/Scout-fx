import { MEDIA_LIMITS } from "@/lib/mediaTypes";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Shrinks a photo in the browser before upload (phone photos are often 5–10 MB,
 * more than the server accepts). The server then converts it to WebP and strips
 * metadata. Small images are sent as they are.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (!ACCEPTED.includes(file.type)) throw new Error(`${file.name}: only JPG, PNG or WebP images.`);
  if (file.size > MEDIA_LIMITS.pickMaxBytes) throw new Error(`${file.name} is over 25 MB.`);

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MEDIA_LIMITS.maxSide / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q));
  // WebP where the browser can make it, otherwise JPEG
  let blob = await toBlob("image/webp", 0.86);
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg", 0.86);
  if (!blob) return file;
  if (blob.size > MEDIA_LIMITS.uploadMaxBytes) throw new Error(`${file.name} is still too large after resizing.`);
  const name = file.name.replace(/\.[a-z0-9]+$/i, "") + (blob.type === "image/webp" ? ".webp" : ".jpg");
  return new File([blob], name, { type: blob.type });
}
