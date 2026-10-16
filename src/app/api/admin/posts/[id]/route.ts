import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { deletePost, getPost, savePost } from "@/lib/posts";
import { validatePost } from "@/lib/postValidation";

type Ctx = { params: Promise<{ id: string }> };

// GET -> one post with its body, for the editor
export async function GET(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const post = await getPost((await params).id);
  return post ? NextResponse.json({ post }) : NextResponse.json({ error: "Post not found." }, { status: 404 });
}

// PATCH <post fields> -> validate and save (also publishes/unpublishes via status)
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const checked = validatePost(body, admin.email);
  if ("error" in checked) return NextResponse.json({ error: checked.error }, { status: 400 });
  const result = await savePost((await params).id, checked.data);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 409 });
  return NextResponse.json({ ok: true, post: checked.data });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  await deletePost((await params).id);
  return NextResponse.json({ ok: true });
}
