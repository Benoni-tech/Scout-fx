import { NextRequest, NextResponse } from "next/server";
import { readFormBody } from "@/lib/requestGuard";
import { getLivePosts } from "@/lib/posts";
import { recordView } from "@/lib/postStats";

// Search engines, link previews and monitoring tools don't count as readers.
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|headless|lighthouse/i;

// POST { postId } from the article page (once per browser per 30 minutes).
export async function POST(req: NextRequest) {
  const parsed = await readFormBody(req);
  if (parsed.error) return parsed.error;
  if (BOT_RE.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });

  const postId = typeof parsed.body.postId === "string" ? parsed.body.postId : "";
  // Only live articles can be counted (cached list, so this costs no database read).
  if (!(await getLivePosts()).some((p) => p.id === postId)) return new NextResponse(null, { status: 204 });

  try {
    await recordView(postId);
  } catch (err) {
    console.error("Couldn't record a view:", err);
  }
  return new NextResponse(null, { status: 204 });
}
