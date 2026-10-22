import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import PostCover from "@/components/blog/PostCover";
import { CategoryPill, postDate, type PostSummary } from "@/components/blog/PostCards";
import { AUTHORS, BLOG_CATEGORIES } from "@/lib/blog";
import { SOCIAL_LINKS, WHATSAPP_CONTACT } from "@/lib/social";

// Featured images are 1200×630; cards use the same shape so the whole image shows.
const IMAGE_SHAPE = "aspect-[1200/630]";

// Building blocks for the magazine-style blog pages (/blog, page 2+, categories).

export const PAGE_SIZE = 10;

function Byline({ post, light = false }: { post: PostSummary; light?: boolean }) {
  const a = AUTHORS[post.author] ?? AUTHORS["coach-emma"];
  return (
    <p className={`flex flex-wrap items-center gap-2 text-xs ${light ? "text-zinc-300" : "text-zinc-500"}`}>
      <Image src={a.photo} alt="" width={20} height={20} className="h-5 w-5 rounded-full object-cover" />
      <span className={`font-semibold ${light ? "text-white" : "text-zinc-300"}`}>{a.name}</span>
      <span className="text-zinc-600">·</span>
      {postDate(post.publishedAt)}
    </p>
  );
}

/** Section title in the "/ Latest /" style. */
export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-xl font-bold text-white sm:text-2xl">
        <span className="mr-2 text-brand-500">/</span>
        {children}
        <span className="ml-2 text-brand-500">/</span>
      </h2>
      {aside}
    </div>
  );
}

/**
 * Image card with the text on it. The image is darkened from the bottom so
 * white text stays readable on any photo.
 */
export function OverlayCard({
  post,
  size = "md",
  rank,
  priority = false,
}: {
  post: PostSummary;
  size?: "lg" | "md";
  rank?: number;
  priority?: boolean;
}) {
  const lg = size === "lg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative block overflow-hidden rounded-3xl border border-white/10 ${lg ? "min-h-[320px]" : "min-h-[220px]"} sm:min-h-0 sm:aspect-[1200/630]`}
    >
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
        <PostCover
          seed={post.slug}
          category={post.category}
          image={post.cover}
          className="h-full w-full"
          sizes={lg ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
          priority={priority}
        />
      </div>
      {/* readability: overall dim + strong gradient behind the text */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      {rank !== undefined && (
        <span className="absolute right-5 top-4 text-5xl font-extrabold text-white/25">{String(rank).padStart(2, "0")}</span>
      )}
      <div className={`absolute inset-x-0 bottom-0 ${lg ? "p-6 sm:p-8" : "p-5"}`}>
        <CategoryPill category={post.category} solid />
        <h3 className={`mt-3 font-bold leading-tight text-white ${lg ? "text-2xl sm:text-4xl" : "line-clamp-3 text-lg"}`}>{post.title}</h3>
        {lg && post.excerpt && <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-zinc-300">{post.excerpt}</p>}
        <div className="mt-4">
          <Byline post={post} light />
        </div>
      </div>
    </Link>
  );
}

/** Text left, small image right (the strip under the hero). */
export function SideCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20">
      <div className="min-w-0 flex-1">
        <CategoryPill category={post.category} />
        <h3 className="mt-2 line-clamp-2 font-bold leading-snug text-white transition-colors group-hover:text-brand-500">{post.title}</h3>
        <div className="mt-3">
          <Byline post={post} />
        </div>
      </div>
      <PostCover seed={post.slug} category={post.category} image={post.cover} className={`${IMAGE_SHAPE} w-32 shrink-0 rounded-2xl border border-white/10 sm:w-44`} sizes="176px" />
    </Link>
  );
}

/** Wide feature: text on the left, image on the right. */
export function SplitFeature({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid items-center gap-6 sm:grid-cols-2">
      <div>
        <CategoryPill category={post.category} />
        <h3 className="mt-3 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-brand-500">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>}
        <div className="mt-4">
          <Byline post={post} />
        </div>
      </div>
      <PostCover seed={post.slug} category={post.category} image={post.cover} className={`${IMAGE_SHAPE} rounded-3xl border border-white/10`} sizes="(min-width: 1024px) 380px, 100vw" />
    </Link>
  );
}

/** Image on top, then tag, title and date. */
export function MiniCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative">
        <PostCover seed={post.slug} category={post.category} image={post.cover} className={`${IMAGE_SHAPE} rounded-2xl border border-white/10`} sizes="(min-width: 1024px) 380px, 100vw" />
        <span className="absolute bottom-3 left-3">
          <CategoryPill category={post.category} solid />
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 font-bold leading-snug text-white transition-colors group-hover:text-brand-500">{post.title}</h3>
      <p className="mt-2 text-xs text-zinc-500">
        {postDate(post.publishedAt)} · {post.readingMinutes} min read
      </p>
    </Link>
  );
}

/** Small ranked row for "Most read" (04, 05, 06…). */
export function RankRow({ post, rank }: { post: PostSummary; rank: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3 pr-14">
      <PostCover seed={post.slug} category={post.category} image={post.cover} className={`${IMAGE_SHAPE} w-28 shrink-0 rounded-xl border border-white/10`} sizes="112px" />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand-500">{post.title}</h3>
        <p className="mt-1 text-xs text-zinc-500">{postDate(post.publishedAt)}</p>
      </div>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl font-extrabold text-white/15">{String(rank).padStart(2, "0")}</span>
    </Link>
  );
}

// ---------- sidebar widgets

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-base font-bold text-white">
        <span className="mr-2 text-brand-500">/</span>
        {title}
        <span className="ml-2 text-brand-500">/</span>
      </h2>
      {children}
    </section>
  );
}

export function BlogSidebar({ counts }: { counts: Record<string, number> }) {
  const socials = [
    { label: "Facebook", sub: "Like", href: SOCIAL_LINKS.facebook, Icon: Facebook },
    { label: "Instagram", sub: "Follow", href: SOCIAL_LINKS.instagram, Icon: Instagram },
    { label: "LinkedIn", sub: "Follow", href: SOCIAL_LINKS.linkedin, Icon: Linkedin },
    { label: "WhatsApp", sub: "Chat", href: WHATSAPP_CONTACT, Icon: MessageCircle },
  ];
  return (
    <aside className="space-y-10 lg:sticky lg:top-28">
      <Widget title="Follow us">
        <div className="grid grid-cols-2 gap-3">
          {socials.map(({ label, sub, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-brand-500/50"
            >
              <Icon className="h-5 w-5 shrink-0 text-brand-500" />
              <span>
                <span className="block text-sm font-semibold text-white">{label}</span>
                <span className="block text-xs text-zinc-500">{sub}</span>
              </span>
            </a>
          ))}
        </div>
      </Widget>

      <Widget title="Categories">
        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {BLOG_CATEGORIES.map((c) => (
            <li key={c.key}>
              <Link href={`/blog/category/${c.key}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white">
                {c.name}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400">{counts[c.key] ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/15 blur-2xl" />
        <p className="relative text-[11px] font-bold uppercase tracking-widest text-brand-500">Free community</p>
        <p className="relative mt-2 text-base font-bold text-white">Learn with other traders on WhatsApp</p>
        <Link href="/join" className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-bold text-black hover:bg-brand-600">
          Join free <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </aside>
  );
}

// ---------- pagination

export function Pagination({ page, pages, base }: { page: number; pages: number; base: string }) {
  if (pages <= 1) return null;
  const href = (n: number) => (n <= 1 ? base : `${base}?page=${n}`);
  // first, last, and the pages around the current one
  const nums = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const btn = "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors";
  return (
    <nav aria-label="Pages" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={`${btn} gap-1.5 border-white/15 text-white hover:bg-white/5`}>
          <ArrowLeft className="h-4 w-4" /> Previous
        </Link>
      ) : (
        <span className={`${btn} gap-1.5 border-white/5 text-zinc-600`}>
          <ArrowLeft className="h-4 w-4" /> Previous
        </span>
      )}
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && n - nums[i - 1] > 1 && <span className="text-zinc-600">…</span>}
          <Link
            href={href(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${btn} ${n === page ? "border-brand-500 bg-brand-500 text-black" : "border-white/15 text-zinc-300 hover:bg-white/5"}`}
          >
            {n}
          </Link>
        </span>
      ))}
      {page < pages ? (
        <Link href={href(page + 1)} rel="next" className={`${btn} gap-1.5 border-white/15 text-white hover:bg-white/5`}>
          Next <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${btn} gap-1.5 border-white/5 text-zinc-600`}>
          Next <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

/** Reads ?page=N; anything invalid is page 1, past the end is the last page. */
export function pageFrom(raw: string | string[] | undefined, total: number) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return { page: Number.isInteger(n) && n > 1 ? Math.min(n, pages) : 1, pages };
}
