// Blog: shared types, categories and the author. Safe to import in the browser
// (the admin editor) and on the server (public pages, API routes).

export const BLOG_CATEGORIES = [
  {
    key: "start-here",
    name: "Start Here",
    description: "Basics, sessions, demo vs live, scams and brokers.",
  },
  {
    key: "mindset-and-risk",
    name: "Mindset and Risk",
    description: "Psychology, greed, emotions and protecting your money.",
  },
  {
    key: "charts-and-markets",
    name: "Charts and Markets",
    description: "Technical analysis, indicators and gold.",
  },
  {
    key: "news",
    name: "News",
    description: "Market-moving news on forex, gold and the cedi, and what it means for traders.",
  },
] as const;

export type CategoryKey = (typeof BLOG_CATEGORIES)[number]["key"];

export function categoryName(key: string) {
  return BLOG_CATEGORIES.find((c) => c.key === key)?.name ?? key;
}

export function isCategory(key: unknown): key is CategoryKey {
  return BLOG_CATEGORIES.some((c) => c.key === key);
}

// Tags cut across categories: a category says what a post is about, tags say
// what kind of post it is and what it covers. A fixed list (not free text) keeps
// "Analysis" and "analysis" from becoming two thin pages.
export const BLOG_TAGS = [
  { key: "outlook", name: "Outlook", description: "What to watch in the markets in the days and weeks ahead." },
  { key: "analysis", name: "Analysis", description: "In-depth breakdowns of price moves, setups and the reasons behind them." },
  { key: "weekly-recap", name: "Weekly Recap", description: "The week in forex and gold, summed up." },
  { key: "gold", name: "Gold", description: "Gold (XAU/USD): price action, drivers and how to trade it." },
  { key: "forex-pairs", name: "Forex Pairs", description: "EUR/USD, GBP/USD, USD/JPY and the other major and minor pairs." },
  { key: "central-banks", name: "Central Banks", description: "The Fed, ECB, Bank of England, Bank of Ghana and their rate decisions." },
  { key: "economic-data", name: "Economic Data", description: "CPI, NFP, GDP and the other releases that move markets." },
  { key: "ghana-and-cedi", name: "Ghana & Cedi", description: "The cedi, Ghana's economy and trading from Ghana." },
  { key: "strategy", name: "Strategy", description: "Trading methods, entries, exits and plans you can test." },
  { key: "beginner", name: "Beginner", description: "Easy-to-follow articles for people new to trading." },
] as const;

export type TagKey = (typeof BLOG_TAGS)[number]["key"];

/** Most tags one post can have. */
export const MAX_TAGS = 3;

/** A tag page only shows in Google and the sitemap once it has this many live posts. */
export const TAG_INDEX_MIN = 3;

export function tagName(key: string) {
  return BLOG_TAGS.find((t) => t.key === key)?.name ?? key;
}

export function isTag(key: unknown): key is TagKey {
  return BLOG_TAGS.some((t) => t.key === key);
}

export const AUTHORS = {
  "coach-emma": {
    name: "Coach Emma",
    role: "Founder and lead educator, Scout FX",
    photo: "/speakers/coach-emma.jpg",
    bio: "Coach Emma founded Scout FX to teach trading the honest way: fundamentals first, risk before reward, and no get-rich-quick promises. Through free seminars, live sessions and the Scout FX community, Emma has helped more than 4,000 people across Ghana understand how the forex and gold markets really work.",
  },
} as const;

export type AuthorKey = keyof typeof AUTHORS;

/** One node of Tiptap's document (its JSON format). */
export type ContentNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ContentNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
};

export type Faq = { q: string; a: string };

export type PostSeo = {
  /** Shown in Google and the browser tab; falls back to the post title. */
  title: string;
  /** Shown under the title in Google; falls back to the excerpt. */
  description: string;
  focusKeyword: string;
  keywords: string[];
  /** Only set when the article first appeared elsewhere. */
  canonical: string;
  noindex: boolean;
};

export type PostCover = {
  url: string;
  alt: string;
  path: string;
  /** Shown under the featured image, with the credit as "Photo: …". */
  caption?: string;
  credit?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  /** When it goes (or went) live. A future date means scheduled. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  category: CategoryKey;
  tags: TagKey[];
  excerpt: string;
  /** "Need to know" key points shown after the featured image (up to 3). */
  highlights: string[];
  cover: PostCover | null;
  content: ContentNode;
  seo: PostSeo;
  faqs: Faq[];
  author: AuthorKey;
  wordCount: number;
  readingMinutes: number;
};

export const EMPTY_DOC: ContentNode = { type: "doc", content: [{ type: "paragraph" }] };

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "How to Start Forex Trading in Ghana!" -> "how-to-start-forex-trading-in-ghana" */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function isLive(post: Pick<Post, "status" | "publishedAt">, now = Date.now()) {
  return post.status === "published" && !!post.publishedAt && Date.parse(post.publishedAt) <= now;
}

export function postStatusLabel(post: Pick<Post, "status" | "publishedAt">) {
  if (post.status === "draft") return "Draft";
  return isLive(post) ? "Published" : "Scheduled";
}

/** Recommended lengths shown in the editor (Google truncates beyond these). */
export const SEO_LIMITS = { title: 60, description: 160 };
