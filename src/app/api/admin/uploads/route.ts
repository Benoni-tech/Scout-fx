import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { MAX_IMAGE_BYTES, sniffImage, StorageNotEnabledError, uploadBlogImage } from "@/lib/storage";

// POST multipart/form-data { file } -> { url, path } of the uploaded blog image
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No image received." }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return NextResponse.json({ error: "Images must be 3 MB or smaller." }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniffImage(buf);
  if (!type) return NextResponse.json({ error: "Only JPG, PNG or WebP images can be uploaded." }, { status: 415 });

  try {
    return NextResponse.json(await uploadBlogImage(buf, type));
  } catch (err) {
    if (err instanceof StorageNotEnabledError) {
      return NextResponse.json({ error: "Image storage isn't switched on yet. Enable Firebase Storage first." }, { status: 503 });
    }
    console.error("Image upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }
}
