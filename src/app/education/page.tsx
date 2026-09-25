import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";
import ArticleCover from "@/components/ArticleCover";
import Reveal from "@/components/Reveal";
import { articles } from "@/lib/articles";

const categories = ["All", "Technical Analysis", "Risk Management", "Trading Psychology", "Market Basics"];

export default async function EducationPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "All" } = await searchParams;
  const list = category === "All" ? articles : articles.filter((a) => a.category === category);
  const [featured, ...rest] = list;

  return (
    <section className="relative py-16">
      <Container className="relative">
        <Eyebrow>Education, not advice</Eyebrow>
        <h1 className="text-gradient mt-5 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Learn the market properly
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
          These articles explain how markets and indicators work. They are
          not trade recommendations. See the signals section for the
          logged, rule-based calls.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={c === "All" ? "/education" : `/education?category=${encodeURIComponent(c)}`}
              aria-current={c === category ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                c === category
                  ? "border-brand-500 bg-brand-500 text-black"
                  : "border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {!featured && (
          <p className="mt-12 text-sm text-zinc-400">No articles in this category yet.</p>
        )}

        {featured && (
          <Reveal className="mt-10">
            <Link
              href={`/education/${featured.slug}`}
              className="card card-hover group grid overflow-hidden md:grid-cols-2"
            >
              <ArticleCover article={featured} className="aspect-[16/10] md:aspect-auto md:min-h-[320px]" />
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="w-fit rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
                  Featured · {featured.category}
                </span>
                <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                  {featured.body[0]}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white">
                  Read article
                  <ArrowUpRight className="h-4 w-4 text-brand-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link
                href={`/education/${a.slug}`}
                className="card card-hover group flex h-full flex-col overflow-hidden"
              >
                <ArticleCover article={a} className="aspect-[16/9]" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-500">{a.category}</span>
                    <span className="text-xs text-zinc-500">{a.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-white">
                    {a.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-zinc-400 transition-colors group-hover:text-white">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
