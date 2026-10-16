import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import PostCover from "@/components/blog/PostCover";
import type { PostSummary } from "@/components/blog/PostCards";
import { categoryName } from "@/lib/blog";

/** "today", "3 days ago", "2 weeks ago", "1 month ago"… */
export function timeAgo(iso: string | null, now = Date.now()) {
  if (!iso) return "";
  const days = Math.floor((now - Date.parse(iso)) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (days < 30) return Math.floor(days / 7) === 1 ? "1 week ago" : `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return Math.floor(days / 30) === 1 ? "1 month ago" : `${Math.floor(days / 30)} months ago`;
  return Math.floor(days / 365) === 1 ? "1 year ago" : `${Math.floor(days / 365)} years ago`;
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.2em] text-white">
      {children}
      <span className="h-px flex-1 bg-white/10" />
    </h2>
  );
}

function Item({ post, meta, label }: { post: PostSummary; meta: string; label?: string }) {
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[88px_1fr] gap-3">
        <PostCover
          seed={post.slug}
          category={post.category}
          image={post.cover}
          className="aspect-[4/3] rounded-xl border border-white/10"
          sizes="88px"
        />
        <div className="min-w-0">
          {label && <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">{label}</p>}
          <p className="mt-0.5 line-clamp-3 text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand-500">
            {post.title}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{meta}</p>
        </div>
      </Link>
    </li>
  );
}

/**
 * Right-hand column on an article: related articles (same category first),
 * then what to read next, then the community invite. Stays in view on desktop.
 */
export default function ArticleSidebar({ related, upNext }: { related: PostSummary[]; upNext: PostSummary[] }) {
  return (
    <aside className="space-y-10 lg:sticky lg:top-24">
      {related.length > 0 && (
        <section>
          <Heading>Related news</Heading>
          <ul className="mt-5 space-y-5">
            {related.map((p) => (
              <Item key={p.id} post={p} label={categoryName(p.category)} meta={timeAgo(p.publishedAt)} />
            ))}
          </ul>
        </section>
      )}

      {upNext.length > 0 && (
        <section>
          <Heading>Up next</Heading>
          <ul className="mt-5 space-y-5">
            {upNext.map((p) => (
              <Item key={p.id} post={p} meta={`${p.readingMinutes} min read`} />
            ))}
          </ul>
        </section>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/15 blur-2xl" />
        <p className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-500">
          <MessageCircle className="h-3.5 w-3.5" /> Free community
        </p>
        <p className="relative mt-2 text-base font-bold leading-snug text-white">Learn with other traders on WhatsApp</p>
        <p className="relative mt-1 text-xs text-zinc-400">New lessons and live session invites. No spam.</p>
        <Link
          href="/join"
          className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-bold text-black hover:bg-brand-600"
        >
          Join free <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </aside>
  );
}
