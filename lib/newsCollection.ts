export type NewsArticle = {
  id?: string;
  title: string;
  source: string;
  url: string;
  published_time: string;
  raw_description: string;
  related_tickers: string[];
  provider?: string;
  created_time: string;
};

export const NEWS_TOPICS = [
  "U.S. stock market",
  "Federal Reserve",
  "interest rates",
  "inflation",
  "Treasury yields",
  "technology stocks",
  "energy market",
  "banking sector",
  "crypto",
  "commodities",
  "major earnings",
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "AMZN",
  "META",
  "GOOGL",
  "JPM",
  "XOM",
  "SPY",
  "QQQ",
  "DIA",
  "IWM",
  "XLK",
  "XLF",
  "XLE",
  "XLV"
];

export const TRACKED_TICKERS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "AMZN",
  "META",
  "GOOGL",
  "JPM",
  "XOM",
  "SPY",
  "QQQ",
  "DIA",
  "IWM",
  "XLK",
  "XLF",
  "XLE",
  "XLV"
];

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "mock-1",
    title: "U.S. stocks steady as investors wait for inflation and Federal Reserve signals",
    source: "MarketPulse Sample",
    url: "https://example.com/marketpulse-sample-us-stocks",
    published_time: new Date().toISOString(),
    raw_description: "Sample fallback article used when NewsAPI, Financial Modeling Prep, or Supabase credentials are not configured.",
    related_tickers: ["SPY", "QQQ", "DIA"],
    provider: "mock",
    created_time: new Date().toISOString()
  },
  {
    id: "mock-2",
    title: "Technology megacaps draw attention ahead of major earnings updates",
    source: "MarketPulse Sample",
    url: "https://example.com/marketpulse-sample-tech-earnings",
    published_time: new Date().toISOString(),
    raw_description: "Sample fallback coverage for AAPL, MSFT, NVDA, AMZN, META, and GOOGL.",
    related_tickers: ["AAPL", "MSFT", "NVDA", "AMZN", "META", "GOOGL", "XLK"],
    provider: "mock",
    created_time: new Date().toISOString()
  },
  {
    id: "mock-3",
    title: "Energy, banks, crypto, and commodities remain active as Treasury yields move",
    source: "MarketPulse Sample",
    url: "https://example.com/marketpulse-sample-cross-asset",
    published_time: new Date().toISOString(),
    raw_description: "Sample fallback article for energy, financials, crypto, commodities, and rates-sensitive market themes.",
    related_tickers: ["XOM", "JPM", "XLE", "XLF", "IWM"],
    provider: "mock",
    created_time: new Date().toISOString()
  }
];

export function extractRelatedTickers(text: string, explicitTicker?: string) {
  const normalizedText = ` ${text.toUpperCase()} `;
  const tickers = new Set<string>();

  if (explicitTicker) {
    tickers.add(explicitTicker.toUpperCase());
  }

  for (const ticker of TRACKED_TICKERS) {
    const pattern = new RegExp(`(^|[^A-Z])${ticker}([^A-Z]|$)`);
    if (pattern.test(normalizedText)) {
      tickers.add(ticker);
    }
  }

  return Array.from(tickers);
}

export function buildNewsQuery() {
  return `(${NEWS_TOPICS.map((topic) => `"${topic}"`).join(" OR ")})`;
}

export function sanitizeArticle(article: NewsArticle): NewsArticle {
  return {
    ...article,
    title: article.title.trim(),
    source: article.source.trim() || "Unknown source",
    url: article.url.trim(),
    raw_description: article.raw_description.trim(),
    related_tickers: Array.from(new Set(article.related_tickers.map((ticker) => ticker.toUpperCase()))),
    created_time: article.created_time || new Date().toISOString()
  };
}
