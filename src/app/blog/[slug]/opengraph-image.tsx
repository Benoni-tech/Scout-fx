import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";
import { getLivePostBySlug } from "@/lib/posts";
import { categoryName } from "@/lib/blog";

export const alt = "Scout FX blog article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Share image for posts without an uploaded cover.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { post } = await getLivePostBySlug((await params).slug);
  return renderOgImage({
    eyebrow: post ? `Blog · ${categoryName(post.category)}` : "Scout FX blog",
    title: post?.title ?? "Learn the market properly",
    subtitle: post ? `${post.readingMinutes} min read · Coach Emma` : undefined,
  });
}
