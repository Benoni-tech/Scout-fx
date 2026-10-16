import type { ContentNode } from "@/lib/blog";

// Post bodies are stored as Tiptap JSON, never as HTML. Everything saved goes
// through cleanContent(), which keeps only the node types, marks and attributes
// below, so nothing pasted into the editor can inject scripts or styles. The
// public page then renders this cleaned tree itself (components/blog/PostContent).

const BLOCKS = new Set([
  "doc", "paragraph", "heading", "bulletList", "orderedList", "listItem", "blockquote",
  "horizontalRule", "hardBreak", "image", "youtube", "codeBlock",
  "table", "tableRow", "tableHeader", "tableCell", "text",
]);
const MARKS = new Set(["bold", "italic", "underline", "strike", "code", "link"]);

const MAX_NODES = 20_000;
const MAX_TEXT = 200_000;

/** Uploaded images live in Firebase Storage; anything else must be on our own site. */
export function isAllowedImage(src: unknown): src is string {
  if (typeof src !== "string") return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const u = new URL(src);
    return u.protocol === "https:" && u.hostname === "firebasestorage.googleapis.com";
  } catch {
    return false;
  }
}

/** Links: http(s), mailto, tel, or a path on this site. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const h = href.trim();
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  if (h.startsWith("#")) return h;
  try {
    const u = new URL(h);
    return ["https:", "http:", "mailto:", "tel:"].includes(u.protocol) ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Any YouTube link -> privacy-friendly embed URL, or null. */
export function youtubeEmbed(src: unknown): string | null {
  if (typeof src !== "string") return null;
  try {
    const u = new URL(src);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ?? "";
    }
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const int = (v: unknown, min: number, max: number, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
};

function cleanAttrs(type: string, a: Record<string, unknown> = {}): Record<string, unknown> | undefined {
  switch (type) {
    case "heading":
      return { level: int(a.level, 2, 4, 2) };
    case "orderedList":
      return { start: int(a.start, 1, 10_000, 1) };
    case "image":
      return { src: a.src, alt: str(a.alt, 300), title: str(a.title, 300) || null };
    case "youtube":
      return { src: youtubeEmbed(a.src) };
    case "tableCell":
    case "tableHeader":
      return { colspan: int(a.colspan, 1, 20, 1), rowspan: int(a.rowspan, 1, 50, 1) };
    case "codeBlock":
      return { language: str(a.language, 30).replace(/[^a-z0-9+#-]/gi, "") || null };
    default:
      return undefined;
  }
}

/** Returns a cleaned copy of a Tiptap document, or null if it isn't one. */
export function cleanContent(input: unknown): ContentNode | null {
  let nodes = 0;
  let textLen = 0;

  function walk(n: unknown, depth: number): ContentNode | null {
    if (!n || typeof n !== "object" || depth > 40 || ++nodes > MAX_NODES) return null;
    const node = n as ContentNode;
    if (typeof node.type !== "string" || !BLOCKS.has(node.type)) return null;

    if (node.type === "text") {
      const text = str(node.text, 20_000);
      if (!text || (textLen += text.length) > MAX_TEXT) return null;
      const marks = (Array.isArray(node.marks) ? node.marks : [])
        .filter((m) => m && MARKS.has(m.type))
        .map((m) => {
          if (m.type !== "link") return { type: m.type };
          const href = safeHref(m.attrs?.href);
          return href ? { type: "link", attrs: { href } } : null;
        })
        .filter(Boolean) as ContentNode["marks"];
      return { type: "text", text, ...(marks && marks.length ? { marks } : {}) };
    }

    const attrs = cleanAttrs(node.type, node.attrs);
    if (node.type === "image" && !isAllowedImage(attrs?.src)) return null;
    if (node.type === "youtube" && !attrs?.src) return null;

    const children = Array.isArray(node.content)
      ? (node.content.map((c) => walk(c, depth + 1)).filter(Boolean) as ContentNode[])
      : undefined;
    return { type: node.type, ...(attrs ? { attrs } : {}), ...(children?.length ? { content: children } : {}) };
  }

  const root = walk(input, 0);
  return root && root.type === "doc" ? root : null;
}

/** Plain text of a document, blocks separated by newlines. */
export function plainText(node: ContentNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  const inner = (node.content ?? []).map(plainText).join(node.type === "doc" ? "\n" : "");
  return ["paragraph", "heading", "listItem", "blockquote"].includes(node.type) ? inner + "\n" : inner;
}

export function countWords(node: ContentNode | undefined) {
  return plainText(node).split(/\s+/).filter(Boolean).length;
}

/** About 220 words a minute, at least one minute. */
export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 220));
}

/** First paragraph's text, used for the SEO checklist and default excerpts. */
export function firstParagraph(node: ContentNode | undefined) {
  const p = node?.content?.find((n) => n.type === "paragraph" && plainText(n).trim());
  return p ? plainText(p).trim() : "";
}

/** Internal links (to this site) in a document, for the SEO checklist. */
export function hasInternalLink(node: ContentNode | undefined): boolean {
  if (!node) return false;
  if (node.marks?.some((m) => m.type === "link" && String(m.attrs?.href ?? "").match(/^\/|scoutsfx\.com/))) return true;
  return (node.content ?? []).some(hasInternalLink);
}
