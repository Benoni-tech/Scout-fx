import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { addMedia, listMedia } from "@/lib/media";
import { MEDIA_LIMITS } from "@/lib/mediaTypes";
import { StorageNotEnabledError } from "@/lib/storage";

// GET -> the whole media library, newest first
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json({ media: await listMedia() });
}

// POST multipart { file, alt?, caption?, credit? } -> the new media item
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No image received." }, { status: 400 });
  if (file.size > MEDIA_LIMITS.uploadMaxBytes) {
    return NextResponse.json({ error: "That image is too large. Try a smaller one." }, { status: 413 });
  }
  try {
    const item = await addMedia(Buffer.from(await file.arrayBuffer()), file.name, admin.email, {
      alt: form?.get("alt"),
      caption: form?.get("caption"),
      credit: form?.get("credit"),
    });
    return NextResponse.json({ item });
  } catch (err) {
    if (err instanceof StorageNotEnabledError) {
      return NextResponse.json({ error: "Image storage isn't switched on yet. Enable Firebase Storage first." }, { status: 503 });
    }
    const msg = err instanceof Error && err.message.startsWith("Only JPG") ? err.message : "Upload failed. Try another image.";
    if (!msg.startsWith("Only JPG")) console.error("Media upload failed:", err);
    return NextResponse.json({ error: msg }, { status: msg.startsWith("Only JPG") ? 415 : 500 });
  }
}
