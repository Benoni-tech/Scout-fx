import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import NewsletterForm from "@/components/NewsletterForm";
import { articles } from "@/lib/articles";

const categories = ["All", "Technical Analysis", "Risk Management", "Trading Psychology", "Market Basics"];

export default function EducationPage() {
  return (
    <section className="py-16">
      <Container>
        <Eyebrow>Education, not advice</Eyebrow>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          Learn the market properly
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
          These articles explain how markets and indicators work. They are
          not trade recommendations. See the signals section for the
          logged, rule-based calls.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              className="rounded-full border border-ink-100 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100/50 aria-selected:bg-brand-600 aria-selected:text-white"
              aria-selected={c === "All"}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/education/${a.slug}`}
              className="rounded-2xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-600">{a.category}</span>
                <span className="text-xs text-ink-300">{a.readTime}</span>
              </div>
              <h3 className="mt-3 text-base font-bold leading-snug text-ink-900">
                {a.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center rounded-3xl border border-ink-100 bg-ink-100/20 p-8 text-center">
          <h3 className="text-lg font-bold text-ink-900">
            New articles, straight to your inbox
          </h3>
          <div className="mt-4">
            <NewsletterForm source="education-index" />
          </div>
        </div>
      </Container>
    </section>
  );
}
