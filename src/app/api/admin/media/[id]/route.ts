import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { deleteMedia, mediaUsage, updateMedia } from "@/lib/media";

type Ctx = { params: Promise<{ id: string }> };

// GET -> where this image is used
export async function GET(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const doc = await getAdminDb().collection("media").doc((await params).id).get();
  if (!doc.exists) return NextResponse.json({ error: "Image not found." }, { status: 404 });
  return NextResponse.json({ usedIn: await mediaUsage(doc.data()!.url) });
}

// PATCH { alt, caption, credit } -> update the library's details (articles keep their own copy)
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const body = await req.json().catch(() => ({}));
  const ok = await updateMedia((await params).id, body);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Image not found." }, { status: 404 });
}

// DELETE -> refused (409, with the articles) while any article still uses it
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const result = await deleteMedia((await params).id);
  if ("notFound" in result) return NextResponse.json({ error: "Image not found." }, { status: 404 });
  if ("usedIn" in result) {
    return NextResponse.json({ error: "This image is used in articles. Remove it from them first.", usedIn: result.usedIn }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
