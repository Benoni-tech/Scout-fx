import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/tickets";
import { getLivePosts } from "@/lib/posts";
import { openEvents } from "@/lib/registration";
import { BLOG_CATEGORIES } from "@/lib/blog";

// /sitemap.xml: every public page Google should know about. Regenerated with the
// blog cache, so new posts appear as soon as they're published.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (path: string, priority = 0.6, lastModified?: string) => ({
    url: `${SITE_URL}${path}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
  });
  const [posts, events] = await Promise.all([getLivePosts(), openEvents()]);
  return [
    page("/", 1),
    page("/blog", 0.9, posts[0]?.updatedAt),
    ...BLOG_CATEGORIES.map((c) => page(`/blog/category/${c.key}`, 0.6)),
    ...posts.filter((p) => !p.seo.noindex && !p.seo.canonical).map((p) => page(`/blog/${p.slug}`, 0.8, p.updatedAt)),
    page("/events", 0.8),
    ...events.map((e) => page(`/events/${e.id}`, 0.9)),
    page("/join", 0.8),
    page("/about", 0.5),
    page("/contact", 0.5),
    page("/open-account", 0.4),
    page("/partnerships", 0.4),
    page("/media-kit", 0.3),
    page("/compliance", 0.2),
    page("/legal/risk-disclosure", 0.2),
    page("/legal/terms", 0.2),
    page("/legal/privacy", 0.2),
  ];
}
