import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogIndex from "@/components/blog/BlogIndex";
import { getLivePosts } from "@/lib/posts";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ key: string }> };

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ key: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.key === key);
  if (!cat) return {};
  return buildMetadata({ title: `${cat.name} | Blog`, description: cat.description, path: `/blog/category/${cat.key}` });
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.key === key);
  if (!cat) notFound();
  const all = await getLivePosts();
  return (
    <BlogIndex
      posts={all.filter((p) => p.category === cat.key)}
      all={all}
      heading={cat.name}
      subheading={cat.description}
      activeCategory={cat.key}
    />
  );
}
