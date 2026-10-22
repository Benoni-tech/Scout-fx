import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

/** Standard grid card: text first, then image, then author. */
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group card card-hover flex flex-col p-6">
      <div className="flex items-center gap-3">
        <CategoryPill category={post.category} />
        <span className="text-xs text-zinc-500">{post.readingMinutes} min read</span>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-snug text-white">{post.title}</h3>
      <PostCover seed={post.slug} category={post.category} image={post.cover} className="mt-5 aspect-[1200/630] rounded-2xl border border-white/10" />
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
