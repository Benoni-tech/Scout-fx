import type { ReactNode } from "react";
import type { ContentNode } from "@/lib/blog";
import { safeHref, youtubeEmbed, isAllowedImage } from "@/lib/blogContent";

// Renders a (cleaned) Tiptap document as article HTML. Only the node types below
// are rendered; anything else is skipped, so stored content can never inject
// markup. Used by the public post page and the admin preview.

function marks(node: ContentNode, child: ReactNode, key: number): ReactNode {
  let out = child;
  for (const m of node.marks ?? []) {
    if (m.type === "bold") out = <strong>{out}</strong>;
    else if (m.type === "italic") out = <em>{out}</em>;
    else if (m.type === "underline") out = <u>{out}</u>;
    else if (m.type === "strike") out = <s>{out}</s>;
    else if (m.type === "code") out = <code>{out}</code>;
    else if (m.type === "link") {
      const href = safeHref(m.attrs?.href);
      if (!href) continue;
      const external = /^https?:/.test(href) && !/^https?:\/\/(www\.)?scoutsfx\.com/.test(href);
      out = (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
          {out}
        </a>
      );
    }
  }
  return <span key={key}>{out}</span>;
}

function children(node: ContentNode) {
  return (node.content ?? []).map((c, i) => render(c, i));
}

function render(node: ContentNode, key: number): ReactNode {
  switch (node.type) {
    case "text":
      return marks(node, node.text, key);
    case "paragraph":
      return <p key={key}>{children(node)}</p>;
    case "heading": {
      const level = Number(node.attrs?.level);
      const Tag = level === 3 ? "h3" : level === 4 ? "h4" : "h2";
      return <Tag key={key}>{children(node)}</Tag>;
    }
    case "bulletList":
      return <ul key={key}>{children(node)}</ul>;
    case "orderedList":
      return <ol key={key} start={Number(node.attrs?.start) || 1}>{children(node)}</ol>;
    case "listItem":
      return <li key={key}>{children(node)}</li>;
    case "blockquote":
      return <blockquote key={key}>{children(node)}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{children(node)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const src = node.attrs?.src;
      if (!isAllowedImage(src)) return null;
      const alt = String(node.attrs?.alt ?? "");
      return (
        <figure key={key} className="not-prose my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" className="w-full rounded-2xl border border-white/10" />
          {node.attrs?.title ? (
            <figcaption className="mt-3 text-center text-sm text-zinc-500">{String(node.attrs.title)}</figcaption>
          ) : null}
        </figure>
      );
    }
    case "youtube": {
      const src = youtubeEmbed(node.attrs?.src);
      if (!src) return null;
      return (
        <div key={key} className="not-prose my-10 aspect-video overflow-hidden rounded-2xl border border-white/10">
          <iframe
            src={src}
            title="YouTube video"
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      );
    }
    case "table":
      return (
        <div key={key} className="overflow-x-auto">
          <table>
            <tbody>{children(node)}</tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{children(node)}</tr>;
    case "tableHeader":
    case "tableCell": {
      const Tag = node.type === "tableHeader" ? "th" : "td";
      const colSpan = Number(node.attrs?.colspan) > 1 ? Number(node.attrs?.colspan) : undefined;
      const rowSpan = Number(node.attrs?.rowspan) > 1 ? Number(node.attrs?.rowspan) : undefined;
      return <Tag key={key} colSpan={colSpan} rowSpan={rowSpan}>{children(node)}</Tag>;
    }
    default:
      return null;
  }
}

/** Article body styled for reading (dark theme, brand accents, drop cap). */
export default function PostContent({ doc }: { doc: ContentNode }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-zinc-300 prose-a:text-brand-500 prose-a:underline-offset-4 prose-strong:text-white prose-blockquote:border-l-brand-500 prose-blockquote:text-zinc-200 prose-blockquote:not-italic prose-li:text-zinc-300 prose-li:marker:text-brand-500 prose-hr:border-white/10 prose-th:text-white prose-td:text-zinc-300 prose-code:text-brand-500 prose-code:before:content-none prose-code:after:content-none [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:text-6xl [&>p:first-of-type]:first-letter:font-extrabold [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:text-brand-500"
    >
      {children(doc)}
    </div>
  );
}
