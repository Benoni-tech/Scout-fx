import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PrimaryButton } from "@/components/ui";
import { PostCard, type PostSummary } from "@/components/blog/PostCards";
import {
  BlogSidebar, MiniCard, OverlayCard, PAGE_SIZE, Pagination, RankRow, SectionTitle, SideCard, SplitFeature,
} from "@/components/blog/Magazine";
import { BLOG_CATEGORIES } from "@/lib/blog";

// Note: the shared <Container> can't go narrower or wider than max-w-6xl,
// so these pages use their own wrappers.
const wrap = "mx-auto max-w-6xl px-4";

function countsOf(all: PostSummary[]) {
  return Object.fromEntries(BLOG_CATEGORIES.map((c) => [c.key, all.filter((p) => p.category === c.key).length]));
}

function CategoryChips({ all, active }: { all: PostSummary[]; active?: string }) {
  const chip = (href: string, label: string, count: number, on: boolean) => (
    <Link
      key={href}
      href={href}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        on ? "border-brand-500 bg-brand-500 text-black" : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${on ? "bg-black/15" : "bg-white/10 text-zinc-400"}`}>{count}</span>
    </Link>
  );
  const counts = countsOf(all);
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="flex w-max gap-2">
        {chip("/blog", "All articles", all.length, !active)}
        {BLOG_CATEGORIES.map((c) => chip(`/blog/category/${c.key}`, c.name, counts[c.key], active === c.key))}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className={`${wrap} pb-24 pt-10 text-center`}>
      <div className="card mx-auto max-w-lg p-10">
        <Sparkles className="mx-auto h-6 w-6 text-brand-500" />
        <p className="mt-4 text-lg font-bold text-white">The first articles are on the way</p>
        <p className="mt-2 text-sm text-zinc-400">Join the community to hear when they&apos;re published.</p>
        <div className="mt-6">
          <PrimaryButton href="/join">Join free</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/** /blog page 1: magazine front page with the 10 newest articles, then "Most read". */
export function BlogFront({ all, mostRead, pages }: { all: PostSummary[]; mostRead: PostSummary[]; pages: number }) {
  if (!all.length) return <Empty />;
  const p = all.slice(0, PAGE_SIZE);
  const [hero, side1, side2, row1, row2, feature, ...minis] = p;

  return (
    <div className="pb-24">
      {/* hero: big story + two stacked */}
      <section className={`${wrap} pt-6`}>
        <div className="grid items-start gap-5 lg:grid-cols-3">
          <div className={side1 ? "lg:col-span-2" : "lg:col-span-3"}>
            <OverlayCard post={hero} size="lg" priority />
          </div>
          {side1 && (
            <div className="grid gap-5">
              <OverlayCard post={side1} />
              {side2 && <OverlayCard post={side2} />}
            </div>
          )}
        </div>
        {row1 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <SideCard post={row1} />
            {row2 && <SideCard post={row2} />}
          </div>
        )}
      </section>

      <section className={`${wrap} pt-8`}>
        <CategoryChips all={all} />
      </section>

      {/* latest + sidebar */}
      <section className={`${wrap} grid gap-12 pt-14 lg:grid-cols-[minmax(0,1fr)_320px]`}>
        <div className="min-w-0">
          {feature && (
            <>
              <SectionTitle>Latest</SectionTitle>
              <SplitFeature post={feature} />
            </>
          )}
          {minis.length > 0 && (
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {minis.map((m) => (
                <MiniCard key={m.id} post={m} />
              ))}
            </div>
          )}
          <Pagination page={1} pages={pages} base="/blog" />
        </div>
        <BlogSidebar counts={countsOf(all)} />
      </section>

      {/* most read (by views over the last 30 days) */}
      {mostRead.length >= 3 && (
        <section className="mt-20 border-y border-white/10 bg-white/[0.02] py-16">
          <div className={wrap}>
            <SectionTitle>Most read</SectionTitle>
            <div className="grid items-start gap-5 lg:grid-cols-[1.6fr_1fr_1fr]">
              <OverlayCard post={mostRead[0]} size="lg" rank={1} />
              <OverlayCard post={mostRead[1]} rank={2} />
              <OverlayCard post={mostRead[2]} rank={3} />
            </div>
            {mostRead.length > 3 && (
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {mostRead.slice(3, 6).map((m, i) => (
                  <RankRow key={m.id} post={m} rank={i + 4} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/** /blog?page=2+ and category pages: 10 per page in a grid, with the sidebar. */
export function BlogList({
  all,
  posts,
  page,
  pages,
  base,
  heading,
  subheading,
  activeCategory,
}: {
  all: PostSummary[];
  posts: PostSummary[];
  page: number;
  pages: number;
  base: string;
  heading: string;
  subheading?: string;
  activeCategory?: string;
}) {
  const shown = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="pb-24">
      <section className={`${wrap} pt-8`}>
        <h1 className="text-gradient pb-1 text-3xl font-bold tracking-tight sm:text-5xl">{heading}</h1>
        {subheading && <p className="mt-3 max-w-xl text-zinc-400">{subheading}</p>}
        <div className="mt-8">
          <CategoryChips all={all} active={activeCategory} />
        </div>
      </section>

      <section className={`${wrap} grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_320px]`}>
        <div className="min-w-0">
          <SectionTitle aside={pages > 1 ? <span className="text-sm text-zinc-500">Page {page} of {pages}</span> : undefined}>
            {activeCategory ? "Articles" : "All articles"}
          </SectionTitle>
          {shown.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {shown.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">No articles here yet.</p>
          )}
          <Pagination page={page} pages={pages} base={base} />
        </div>
        <BlogSidebar counts={countsOf(all)} />
      </section>
    </div>
  );
}
