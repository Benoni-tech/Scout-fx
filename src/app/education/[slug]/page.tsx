import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import ArticleCover from "@/components/ArticleCover";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { articles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(slug);

  return (
    <article className="py-16">
      <Container className="max-w-2xl">
        <Link href="/education" className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to education
        </Link>

        <div className="mt-6">
          <span className="text-xs font-semibold text-brand-500">{article.category}</span>
          <h1 className="text-gradient mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            {article.date} · {article.readTime} read
          </p>
        </div>

        <ArticleCover article={article} className="mt-8 aspect-[16/8] rounded-2xl border border-white/10" />

        <div className="mt-8 space-y-5">
          {article.body.map((p, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-zinc-300">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <p className="text-xs leading-relaxed text-zinc-400">
            This article is educational and does not constitute financial or
            investment advice. See the full{" "}
            <Link href="/legal/risk-disclosure" className="underline">
              risk disclosure
            </Link>
            .
          </p>
        </div>

        {related.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm font-bold text-white">Related</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/education/${r.slug}`}
                  className="card card-hover group overflow-hidden"
                >
                  <ArticleCover article={r} className="aspect-[16/8]" />
                  <div className="p-4">
                    <span className="text-xs font-semibold text-brand-500">{r.category}</span>
                    <p className="mt-1 text-sm font-semibold leading-snug text-white">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/join"
          className="mt-10 block rounded-2xl bg-brand-600 p-6 text-center text-sm font-semibold text-black transition-all hover:shadow-glow"
        >
          Join the community for weekly education drops →
        </Link>
      </Container>
    </article>
  );
}
