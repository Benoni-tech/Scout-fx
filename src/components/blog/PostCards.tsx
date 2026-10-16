import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PostCover from "@/components/blog/PostCover";
import { AUTHORS, categoryName, type Post } from "@/lib/blog";

export type PostSummary = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "category" | "cover" | "publishedAt" | "readingMinutes" | "author"
>;

export function postDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
}

export function CategoryPill({ category, solid = false }: { category: string; solid?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        solid ? "bg-brand-500 text-black" : "border border-white/15 bg-black/40 text-zinc-200"
      }`}
    >
      {categoryName(category)}
    </span>
  );
}

function Meta({ post }: { post: PostSummary }) {
  return (
    <p className="whitespace-nowrap text-xs text-zinc-400">
      {postDate(post.publishedAt)} <span className="mx-1 text-zinc-600">•</span> {post.readingMinutes} min read
    </p>
  );
}

function Author({ post }: { post: PostSummary }) {
  const a = AUTHORS[post.author] ?? AUTHORS["coach-emma"];
  return (
    <span className="flex items-center gap-2 text-xs text-zinc-400">
      <Image src={a.photo} alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
      <span className="font-semibold text-zinc-200">{a.name}</span>
    </span>
  );
}

function ArrowButton() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-black transition-transform group-hover:rotate-45">
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );
}

/** Cover with a floating info card over its bottom edge (featured row). */
export function FeatureCard({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <PostCover
        seed={post.slug}
        category={post.category}
        image={post.cover}
        className="aspect-[4/3] rounded-3xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.01]"
        priority={priority}
      />
      <div className="relative mx-4 -mt-24 rounded-2xl border border-white/10 bg-zinc-950/85 p-5 shadow-card backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CategoryPill category={post.category} />
          <Meta post={post} />
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white">{post.title}</h3>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="line-clamp-2 text-sm text-zinc-400">{post.excerpt}</p>
          <ArrowButton />
        </div>
      </div>
    </Link>
  );
}

/** Large image card with the text laid over it (lead story in "Latest"). */
export function LeadCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative block h-full min-h-[420px] overflow-hidden rounded-3xl border border-white/10">
      <div className="absolute inset-0">
        <PostCover seed={post.slug} category={post.category} image={post.cover} className="h-full w-full" sizes="(min-width: 1024px) 60vw, 100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
        <div className="max-w-lg">
          <CategoryPill category={post.category} solid />
          <h3 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">{post.title}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Author post={post} />
            <Meta post={post} />
          </div>
        </div>
        <ArrowButton />
      </div>
    </Link>
  );
}

/** Small horizontal card (beside the lead story). */
export function CompactCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group card card-hover grid grid-cols-[120px_1fr] overflow-hidden sm:grid-cols-[160px_1fr]">
      <PostCover seed={post.slug} category={post.category} image={post.cover} className="h-full min-h-[150px]" sizes="160px" />
      <div className="flex flex-col p-4">
        <div className="flex items-center gap-2">
          <CategoryPill category={post.category} />
        </div>
        <h3 className="mt-3 line-clamp-3 text-sm font-bold leading-snug text-white">{post.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <Meta post={post} />
          <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-500" />
        </div>
      </div>
    </Link>
  );
}

/** Standard grid card: text first, then image, then author. */
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group card card-hover flex flex-col p-6">
      <div className="flex items-center gap-3">
        <CategoryPill category={post.category} />
        <span className="text-xs text-zinc-500">{post.readingMinutes} min read</span>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-snug text-white">{post.title}</h3>
      <PostCover seed={post.slug} category={post.category} image={post.cover} className="mt-5 aspect-[16/10] rounded-2xl border border-white/10" />
      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="flex items-center gap-3">
          <Author post={post} />
          <span className="text-xs text-zinc-500">{postDate(post.publishedAt)}</span>
        </span>
        <ArrowButton />
      </div>
    </Link>
  );
}
