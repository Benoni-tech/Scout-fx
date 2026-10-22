import type { Metadata } from "next";
import { BlogFront, BlogList } from "@/components/blog/BlogPages";
import { pageFrom } from "@/components/blog/Magazine";
import { getLivePosts } from "@/lib/posts";
import { cachedPostStats } from "@/lib/postStatsCache";
import { buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ page?: string | string[] }> };

const description = "Plain-English lessons on forex, gold, charts and risk from Coach Emma, written for traders in Ghana.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page } = pageFrom((await searchParams).page, (await getLivePosts()).length);
  return page > 1
    ? buildMetadata({ title: `Blog · Page ${page}`, description, path: `/blog?page=${page}` })
    : buildMetadata({ title: "Blog", description, path: "/blog" });
}

export default async function BlogPage({ searchParams }: Props) {
  const all = await getLivePosts();
  const { page, pages } = pageFrom((await searchParams).page, all.length);

  if (page > 1) {
    return <BlogList all={all} posts={all} page={page} pages={pages} base="/blog" heading="All articles" subheading={description} />;
  }

  // Most read: views in the last 30 days, then all-time views. Unviewed articles aren't ranked.
  const stats = await cachedPostStats();
  const mostRead = all
    .filter((p) => (stats[p.id]?.views ?? 0) > 0)
    .sort((a, b) => (stats[b.id]?.last30 ?? 0) - (stats[a.id]?.last30 ?? 0) || (stats[b.id]?.views ?? 0) - (stats[a.id]?.views ?? 0))
    .slice(0, 6);

  return <BlogFront all={all} mostRead={mostRead} pages={pages} />;
}
