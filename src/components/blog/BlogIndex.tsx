import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Container, PrimaryButton } from "@/components/ui";
import { CompactCard, FeatureCard, LeadCard, PostCard, type PostSummary } from "@/components/blog/PostCards";
import { BLOG_CATEGORIES } from "@/lib/blog";

/** Category chips with post counts; the active one is highlighted. */
function CategoryBar({ all, active }: { all: PostSummary[]; active?: string }) {
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
  return (
    <div className="mask-fade-x -mx-4 overflow-x-auto px-4 py-2">
      <div className="mx-auto flex w-max gap-2">
        {chip("/blog", "All articles", all.length, !active)}
        {BLOG_CATEGORIES.map((c) =>
          chip(`/blog/category/${c.key}`, c.name, all.filter((p) => p.category === c.key).length, active === c.key)
        )}
      </div>
    </div>
  );
}

function CommunityCta() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-500">
            <MessageCircle className="h-4 w-4" /> Free community
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Learn with other traders on WhatsApp</h2>
          <p className="mt-2 max-w-md text-sm text-zinc-400">New lessons, live session invites and answers to your questions. No spam, no pressure to trade.</p>
        </div>
        <PrimaryButton href="/join">
          Join free <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </div>
  );
}

export default function BlogIndex({
  posts,
  all,
  heading,
  subheading,
  activeCategory,
}: {
  /** Posts to show (all, or one category). */
  posts: PostSummary[];
  /** Every live post, for the category counts. */
  all: PostSummary[];
  heading: string;
  subheading: string;
  activeCategory?: string;
}) {
  const featured = activeCategory ? [] : posts.slice(0, 3);
  const rest = activeCategory ? posts : posts.slice(3);
  const [lead, ...others] = rest;
  const side = others.slice(0, 2);
  const grid = others.slice(2);

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 overflow-hidden pb-12 pt-40">
        <div className="spotlight pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
        <Container className="relative text-center">
          <h1 className="text-gradient mx-auto max-w-3xl pb-1 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{heading}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">{subheading}</p>
        </Container>
      </section>

      {posts.length === 0 ? (
        <Container className="pb-24 text-center">
          <div className="card mx-auto max-w-lg p-10">
            <Sparkles className="mx-auto h-6 w-6 text-brand-500" />
            <p className="mt-4 text-lg font-bold text-white">The first articles are on the way</p>
            <p className="mt-2 text-sm text-zinc-400">Join the community to hear when they&apos;re published.</p>
            <div className="mt-6">
              <PrimaryButton href="/join">Join free</PrimaryButton>
            </div>
          </div>
        </Container>
      ) : (
        <>
          {featured.length > 0 && (
            <Container className="grid gap-6 md:grid-cols-3">
              {featured.map((p, i) => (
                <FeatureCard key={p.id} post={p} priority={i === 0} />
              ))}
            </Container>
          )}

          <section className="py-12">
            <Container>
              <CategoryBar all={all} active={activeCategory} />
            </Container>
          </section>

          {lead && (
            <Container className="pb-8">
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <h2 className="text-lg font-bold text-white">{activeCategory ? "Articles" : "Latest articles"}</h2>
                <span className="text-xs text-zinc-500">Plain-English lessons from Coach Emma</span>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <LeadCard post={lead} />
                {side.length > 0 && (
                  <div className="grid gap-6">
                    {side.map((p) => (
                      <CompactCard key={p.id} post={p} />
                    ))}
                  </div>
                )}
              </div>
              {grid.length > 0 && (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {grid.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              )}
            </Container>
          )}
        </>
      )}

      <Container className="pb-24 pt-8">
        <CommunityCta />
      </Container>
    </>
  );
}
