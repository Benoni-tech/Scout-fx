import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogPages";
import { pageFrom } from "@/components/blog/Magazine";
import { getLivePosts } from "@/lib/posts";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ key: string }>; searchParams: Promise<{ page?: string | string[] }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { key } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.key === key);
  if (!cat) return {};
  const posts = (await getLivePosts()).filter((p) => p.category === cat.key);
  const { page } = pageFrom((await searchParams).page, posts.length);
  const path = `/blog/category/${cat.key}`;
  return buildMetadata({
    title: page > 1 ? `${cat.name} · Page ${page} | Blog` : `${cat.name} | Blog`,
    description: cat.description,
    path: page > 1 ? `${path}?page=${page}` : path,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { key } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.key === key);
  if (!cat) notFound();
  const all = await getLivePosts();
  const posts = all.filter((p) => p.category === cat.key);
  const { page, pages } = pageFrom((await searchParams).page, posts.length);
  return (
    <BlogList
      all={all}
      posts={posts}
      page={page}
      pages={pages}
      base={`/blog/category/${cat.key}`}
      heading={cat.name}
      subheading={cat.description}
      activeCategory={cat.key}
    />
  );
}
