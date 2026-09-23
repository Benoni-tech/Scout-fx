export type Article = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "reading-rsi-without-overreacting",
    title: "Reading RSI without overreacting to it",
    category: "Technical Analysis",
    readTime: "6 min",
    date: "August 2026",
    body: [
      "The Relative Strength Index (RSI) measures how fast and how far price has moved recently, on a scale of 0 to 100. Readings above 70 are commonly described as overbought; readings below 30 as oversold.",
      "The mistake most beginners make is treating those thresholds as buy or sell buttons. RSI can stay overbought for a long time during a strong trend, and selling the moment it crosses 70 has burned more accounts than it has protected.",
      "A more useful way to use RSI is as context, not a trigger: does this reading agree with what price is doing at a key level? An oversold reading at a support zone means something different than an oversold reading in the middle of a strong downtrend.",
    ],
  },
  {
    slug: "position-sizing-basics",
    title: "Position sizing: the part beginners skip",
    category: "Risk Management",
    readTime: "8 min",
    date: "August 2026",
    body: [
      "Most new traders pick a position size by guessing, or by copying whatever lot size looks impressive in a screenshot. Position sizing should instead come from a single number: how much of your account you're willing to lose on this trade.",
      "A common rule is to risk 1–2% of account equity per trade. From there, the size is math: risk amount divided by the distance from entry to stop-loss, adjusted for the pair's pip value.",
      "Sizing this way means a losing streak, which will happen, shrinks your account slowly instead of wiping it out. It also removes the temptation to size up after a loss to 'win it back', which is how most blown accounts actually happen.",
    ],
  },
  {
    slug: "why-good-trades-feel-uncomfortable",
    title: "Why your best trades still feel uncomfortable",
    category: "Trading Psychology",
    readTime: "5 min",
    date: "August 2026",
    body: [
      "If a setup feels exciting, that's usually a sign you're chasing, not executing a plan. The trades that follow your rules most closely often feel boring or even slightly wrong in the moment. That discomfort is the cost of discipline, not a signal something's off.",
      "This is why a written checklist matters more than confidence. Confidence is a feeling; a checklist is a fact. If every condition on the list is met, the trade is valid regardless of how it feels.",
      "Over time, the goal isn't to make discomfort disappear. It's to stop using it as a reason to skip or override a rule-based entry.",
    ],
  },
  {
    slug: "support-resistance-basics",
    title: "Support and resistance: what actually holds",
    category: "Technical Analysis",
    readTime: "7 min",
    date: "August 2026",
    body: [
      "Support and resistance are zones where price has previously reversed or paused, not exact lines. Treating them as a precise price to the pip is a common source of frustrated 'the level didn't hold' complaints.",
      "The more times a zone has been tested, the more traders are watching it, which can make reactions there sharper, but also more prone to a fast fakeout before the 'real' move. Waiting for confirmation (a rejection candle, a break and retest) filters out a lot of noise.",
      "The most reliable zones tend to line up with more than one thing at once: a prior swing high/low, a round number, and a moving average, for example. Confluence matters more than any single line on the chart.",
    ],
  },
  {
    slug: "what-stop-loss-protects",
    title: "What a stop-loss is actually protecting",
    category: "Risk Management",
    readTime: "5 min",
    date: "August 2026",
    body: [
      "A stop-loss isn't there to be 'right'. It's there to cap the cost of being wrong. The moment you move it further away to avoid taking a loss, you've turned a defined risk into an undefined one.",
      "The stop should be placed based on where the trade idea is invalidated, such as a structure break or a level failing, not based on how much money you're comfortable losing. If the invalidation point implies a loss you can't accept, the fix is a smaller position, not a wider stop.",
      "Every signal published here logs entry, stop and target before the outcome is known, for exactly this reason: the plan has to be fixed before the emotion of a live trade sets in.",
    ],
  },
  {
    slug: "where-beginners-should-start",
    title: "Forex, gold or crypto: where beginners should start",
    category: "Market Basics",
    readTime: "9 min",
    date: "August 2026",
    body: [
      "Forex majors (like EUR/USD) tend to have tighter spreads and more predictable behavior around news, making them a reasonable place to learn the mechanics of entries, stops and position sizing without excessive volatility working against you.",
      "Gold (XAU/USD) behaves like a hybrid: it reacts to risk sentiment and interest rates, and can move fast, so it rewards traders who already have risk management under control before increasing size.",
      "Crypto tends to have the widest swings and the least predictable structure around news, which is exciting but unforgiving for a beginner still learning to size positions and honor a stop. Most traders are better served starting in forex, proving out a process, then applying it to gold and crypto with size that matches the extra volatility.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 2) {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  const sameCategory = articles.filter(
    (a) => a.slug !== slug && a.category === current.category
  );
  const rest = articles.filter(
    (a) => a.slug !== slug && a.category !== current.category
  );

  return [...sameCategory, ...rest].slice(0, count);
}
