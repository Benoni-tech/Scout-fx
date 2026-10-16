import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { createPost, listAllPosts } from "@/lib/posts";
import { isCategory, slugify } from "@/lib/blog";

// GET -> every post (without bodies) for the admin list
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const posts = (await listAllPosts()).map(({ content: _c, faqs: _f, ...summary }) => summary);
  return NextResponse.json({ posts });
}

// POST { title, category } -> new draft, returns its id
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 140) : "";
  const category = isCategory(body.category) ? body.category : "start-here";
  const { id } = await createPost({ title: title || "Untitled post", slug: slugify(title) || "untitled", category }, admin.email);
  return NextResponse.json({ id });
}
