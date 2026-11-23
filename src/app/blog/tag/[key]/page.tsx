import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogPages";
import { pageFrom } from "@/components/blog/Magazine";
import { getLivePosts } from "@/lib/posts";
import { BLOG_TAGS, TAG_INDEX_MIN } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ key: string }>; searchParams: Promise<{ page?: string | string[] }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { key } = await params;
  const tag = BLOG_TAGS.find((t) => t.key === key);
  if (!tag) return {};
  const posts = (await getLivePosts()).filter((p) => p.tags.includes(tag.key));
  const { page } = pageFrom((await searchParams).page, posts.length);
  const path = `/blog/tag/${tag.key}`;
  const meta = buildMetadata({
    title: page > 1 ? `${tag.name} · Page ${page} | Blog` : `${tag.name} | Blog`,
    description: tag.description,
    path: page > 1 ? `${path}?page=${page}` : path,
  });
  // A tag with only a post or two would be a thin page in Google: keep it out until it grows.
  return posts.length < TAG_INDEX_MIN ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function TagPage({ params, searchParams }: Props) {
  const { key } = await params;
  const tag = BLOG_TAGS.find((t) => t.key === key);
  if (!tag) notFound();
  const all = await getLivePosts();
  const posts = all.filter((p) => p.tags.includes(tag.key));
  const { page, pages } = pageFrom((await searchParams).page, posts.length);
  return (
    <BlogList
      all={all}
      posts={posts}
      page={page}
      pages={pages}
      base={`/blog/tag/${tag.key}`}
      heading={tag.name}
      subheading={tag.description}
      activeTag={tag.key}
    />
  );
}
