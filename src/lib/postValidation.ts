import { isCategory, SLUG_RE, type Post } from "@/lib/blog";
import { cleanContent, countWords, isAllowedImage, readingMinutes, safeHref } from "@/lib/blogContent";

// Server-side checks for a post sent from the admin editor. Returns the exact
// fields to store, or an error message for the editor to show.

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
const longText = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validatePost(
  body: Record<string, unknown>,
  by: string
): { error: string } | { data: Omit<Post, "id" | "createdAt" | "author"> } {
  const title = text(body.title, 140);
  if (!title) return { error: "Add a title." };

  const slug = text(body.slug, 80).toLowerCase();
  if (!SLUG_RE.test(slug)) return { error: "The URL slug can only use lowercase letters, numbers and hyphens." };

  if (!isCategory(body.category)) return { error: "Choose a category." };

  const status = body.status === "published" ? "published" : "draft";
  let publishedAt: string | null = null;
  if (status === "published") {
    const t = typeof body.publishedAt === "string" ? Date.parse(body.publishedAt) : NaN;
    publishedAt = new Date(Number.isFinite(t) ? t : Date.now()).toISOString();
  }

  const content = cleanContent(body.content);
  if (!content) return { error: "The article body couldn't be read. Refresh and try again." };
  const words = countWords(content);
  if (status === "published" && words < 50) return { error: "Write at least 50 words before publishing." };

  const c = (body.cover ?? null) as Record<string, unknown> | null;
  const cover =
    c && isAllowedImage(c.url)
      ? { url: c.url as string, alt: text(c.alt, 200), path: text(c.path, 300) }
      : null;
  if (status === "published" && cover && !cover.alt) return { error: "Add alt text for the cover image (describe the picture)." };

  const s = (body.seo ?? {}) as Record<string, unknown>;
  const keywords = (Array.isArray(s.keywords) ? s.keywords : [])
    .map((k) => text(k, 60))
    .filter(Boolean)
    .slice(0, 10);
  const canonicalRaw = text(s.canonical, 300);
  const canonical = canonicalRaw ? safeHref(canonicalRaw) : "";
  if (canonical === null || (canonical && !/^https?:/.test(canonical))) return { error: "The canonical URL must be a full https:// link." };

  const faqs = (Array.isArray(body.faqs) ? body.faqs : [])
    .map((f) => ({ q: text((f as Record<string, unknown>)?.q, 200), a: longText((f as Record<string, unknown>)?.a, 2000) }))
    .filter((f) => f.q && f.a)
    .slice(0, 20);

  return {
    data: {
      title,
      slug,
      status,
      publishedAt,
      updatedAt: new Date().toISOString(),
      updatedBy: by,
      category: body.category,
      excerpt: text(body.excerpt, 300),
      highlights: (Array.isArray(body.highlights) ? body.highlights : [])
        .map((h) => text(h, 220))
        .filter(Boolean)
        .slice(0, 3),
      cover,
      content,
      seo: {
        title: text(s.title, 120),
        description: text(s.description, 320),
        focusKeyword: text(s.focusKeyword, 80),
        keywords,
        canonical: canonical ?? "",
        noindex: s.noindex === true,
      },
      faqs,
      wordCount: words,
      readingMinutes: readingMinutes(words),
    },
  };
}
