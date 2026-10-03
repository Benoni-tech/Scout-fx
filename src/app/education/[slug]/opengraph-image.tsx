import { articles, getArticleBySlug } from "@/lib/articles";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Scout FX trading education article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticleBySlug((await params).slug);
  return renderOgImage({
    eyebrow: article ? `Education · ${article.category}` : "Scout FX education",
    title: article?.title ?? "Learn the market properly",
    subtitle: article ? `${article.readTime} read` : undefined,
  });
}
