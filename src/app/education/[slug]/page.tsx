import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
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
        <Link href="/education" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" /> Back to education
        </Link>

        <div className="mt-6">
          <span className="text-xs font-semibold text-brand-600">{article.category}</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-ink-300">
            {article.date} · {article.readTime} read
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {article.body.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-ink-700">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-ink-100 bg-ink-100/20 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
          <p className="text-xs leading-relaxed text-ink-500">
            This article is educational and does not constitute financial or
            investment advice. See the full{" "}
            <Link href="/legal/risk-disclosure" className="underline">
              risk disclosure
            </Link>
            .
          </p>
        </div>

        {related.length > 0 && (
          <div className="mt-12 border-t border-ink-100 pt-8">
            <p className="text-sm font-bold text-ink-900">Related</p>
            <ul className="mt-3 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/education/${r.slug}`} className="text-sm font-medium text-brand-600 hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/join"
          className="mt-10 block rounded-2xl bg-brand-600 p-6 text-center text-sm font-semibold text-white"
        >
          Join the community for weekly education drops →
        </Link>
      </Container>
    </article>
  );
}
