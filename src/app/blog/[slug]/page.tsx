import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, ArrowRight, Clock, Facebook, Linkedin, MessageCircle } from "lucide-react";
import Faq from "@/components/Faq";
import PostCover from "@/components/blog/PostCover";
import PostContent from "@/components/blog/PostContent";
import Highlights from "@/components/blog/Highlights";
import { CategoryPill, postDate } from "@/components/blog/PostCards";
import ArticleSidebar from "@/components/blog/ArticleSidebar";
import { getLivePostBySlug, getLivePosts } from "@/lib/posts";
import { AUTHORS, categoryName } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/tickets";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getLivePosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post } = await getLivePostBySlug((await params).slug);
  if (!post) return {};
  const meta = buildMetadata({
    title: post.seo.title ? { absolute: post.seo.title } : post.title,
    shareTitle: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover?.url ?? `/blog/${post.slug}/opengraph-image`,
    imageAlt: post.cover?.alt || post.title,
  });
  return {
    ...meta,
    keywords: [post.seo.focusKeyword, ...post.seo.keywords].filter(Boolean),
    authors: [{ name: AUTHORS[post.author].name }],
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.publishedAt ?? undefined, modifiedTime: post.updatedAt },
    ...(post.seo.canonical ? { alternates: { canonical: post.seo.canonical } } : {}),
    ...(post.seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** "October 9, 2026 9:20 AM GMT" (Ghana is on GMT all year). */
function dateTimeGmt(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
  return `${date} ${time} GMT`;
}

/** Edited at least an hour after it went live. */
function wasUpdated(post: { publishedAt: string | null; updatedAt: string }) {
  return !!post.publishedAt && Date.parse(post.updatedAt) - Date.parse(post.publishedAt) > 3600_000;
}

function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: MessageCircle },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: Facebook },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin },
  ];
  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-brand-500 hover:text-brand-500"
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { post, redirect } = await getLivePostBySlug(slug);
  if (redirect) permanentRedirect(`/blog/${redirect}`);
  if (!post) notFound();

  const all = await getLivePosts();
  const i = all.findIndex((p) => p.id === post.id);
  const newer = all[i - 1];
  const older = all[i + 1];
  // Sidebar: "Related news" is the same category (topped up to 3 with the newest
  // others when a category is small); "Up next" is the newest of the rest.
  const others = all.filter((p) => p.id !== post.id);
  const sameCategory = others.filter((p) => p.category === post.category).slice(0, 4);
  const related = [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, Math.max(3, sameCategory.length));
  const upNext = others.filter((p) => !related.includes(p)).slice(0, 4);
  const author = AUTHORS[post.author];
  const url = `${SITE_URL}/blog/${post.slug}`;

  // Structured data for Google: the article, its FAQs and the breadcrumb trail.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.seo.description || post.excerpt,
      image: post.cover?.url ?? `${SITE_URL}/blog/${post.slug}/opengraph-image`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: author.name, jobTitle: author.role },
      publisher: { "@type": "Organization", name: "Scout FX", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
      mainEntityOfPage: url,
      articleSection: categoryName(post.category),
      keywords: [post.seo.focusKeyword, ...post.seo.keywords].filter(Boolean).join(", ") || undefined,
      wordCount: post.wordCount,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: categoryName(post.category), item: `${SITE_URL}/blog/category/${post.category}` },
        { "@type": "ListItem", position: 4, name: post.title, item: url },
      ],
    },
    ...(post.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <article className="pb-24">
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped can't break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* prev / next */}
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="flex items-center gap-1 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Prev
            </Link>
          ) : (
            <Link href="/blog" className="flex items-center gap-1 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className="flex items-center gap-1 hover:text-white">
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </nav>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <div className="min-w-0 max-w-[760px]">
          {/* title and byline */}
          <div className="pt-10">
            <Link href={`/blog/category/${post.category}`}>
              <CategoryPill category={post.category} solid />
            </Link>
            <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image src={author.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-zinc-400">
                    By <span className="font-semibold text-white">{author.name}</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-zinc-500">
                    <time dateTime={post.publishedAt ?? undefined}>{dateTimeGmt(post.publishedAt)}</time>
                    {wasUpdated(post) && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span>Updated {postDate(post.updatedAt)}</span>
                      </>
                    )}
                    <span className="text-zinc-700">·</span>
                    <Clock className="h-3 w-3" /> {post.readingMinutes} min read
                  </p>
                </div>
              </div>
              <ShareLinks url={url} title={post.title} />
            </div>
          </div>

          {/* featured image */}
          <div className="pt-8">
            <PostCover
              seed={post.slug}
              category={post.category}
              image={post.cover}
              className="aspect-[16/9] rounded-3xl border border-white/10"
              sizes="(min-width: 1024px) 760px, 100vw"
              priority
            />
          </div>

          {/* need to know, then the summary */}
          <div className="pt-4">
            <Highlights items={post.highlights} />
            {post.excerpt && <p className="mt-10 text-lg font-semibold leading-relaxed text-zinc-200 sm:text-xl">{post.excerpt}</p>}
          </div>

          {/* body */}
          <div className="pt-12">
            <PostContent doc={post.content} />

            {post.faqs.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Questions</h2>
                <div className="mt-4">
                  <Faq items={post.faqs} />
                </div>
              </section>
            )}

            {/* author */}
            <div className="mt-16 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-start">
              <Image src={author.photo} alt={author.name} width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Written by</p>
                <p className="mt-1 text-lg font-bold text-white">{author.name}</p>
                <p className="text-sm text-zinc-500">{author.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{author.bio}</p>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <p className="text-xs leading-relaxed text-zinc-400">
                This article is education, not financial advice or a trade recommendation. Trading forex, gold and crypto
                carries a high level of risk. Read the{" "}
                <Link href="/legal/risk-disclosure" className="underline">
                  risk disclosure
                </Link>{" "}
                before you trade.
              </p>
            </div>
          </div>
        </div>

        {/* right sidebar: related, up next, community */}
        <div className="pt-10">
          <ArticleSidebar related={related} upNext={upNext} />
        </div>
      </div>
    </article>
  );
}
