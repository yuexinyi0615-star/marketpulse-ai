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
  short_summary?: string | null;
  why_it_matters_financially?: string | null;
  related_companies?: string[] | null;
  related_etfs?: string[] | null;
  related_sectors?: string[] | null;
  market_classification?: "bullish" | "bearish" | "neutral" | null;
  market_impact_score?: number | null;
  confidence_score?: number | null;
  short_term_impact?: string | null;
  medium_term_impact?: string | null;
  risk_factors?: string[] | null;
  alternative_scenario?: string | null;
  beginner_explanation?: string | null;
  impact_generated_at?: string | null;
  impact_model?: string | null;
};

export type MarketImpactAnalysis = {
  short_summary: string;
  why_it_matters_financially: string;
  related_companies: string[];
  related_tickers: string[];
  related_etfs: string[];
  related_sectors: string[];
  market_classification: "bullish" | "bearish" | "neutral";
  market_impact_score: number;
  confidence_score: number;
  short_term_impact: string;
  medium_term_impact: string;
  risk_factors: string[];
  alternative_scenario: string;
  beginner_explanation: string;
};

export type DailyMarketOutlook = {
  id?: string;
  outlook_date: string;
  generated_at: string;
  market_tone: "bullish" | "bearish" | "neutral";
  outlook_summary: string;
  key_themes: string[];
  opportunities: string[];
  risks: string[];
  watchlist: string[];
  beginner_explanation: string;
  source_article_ids: string[];
  model: string;
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
    created_time: new Date().toISOString(),
    short_summary: "Stocks are steady while investors wait for inflation data and Federal Reserve signals.",
    why_it_matters_financially: "Inflation and Fed policy can move interest rates, valuation multiples, and sector leadership.",
    related_companies: [],
    related_etfs: ["SPY", "QQQ", "DIA"],
    related_sectors: ["Broad market", "Technology"],
    market_classification: "neutral",
    market_impact_score: 58,
    confidence_score: 72,
    short_term_impact: "Index volatility may stay elevated for 1-3 days as traders wait for policy clues.",
    medium_term_impact: "Rates-sensitive sectors could reprice over 1-4 weeks if inflation expectations change.",
    risk_factors: ["Unexpected inflation print", "Fed communication surprise", "Treasury yield spike"],
    alternative_scenario: "If inflation cools faster than expected, equities could respond more bullishly.",
    beginner_explanation: "When investors are unsure about interest rates, stocks often move carefully until new data arrives.",
    impact_generated_at: new Date().toISOString(),
    impact_model: "mock-impact-fallback"
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
    created_time: new Date().toISOString(),
    short_summary: "Large technology companies are in focus before major earnings updates.",
    why_it_matters_financially: "Megacap earnings can influence index direction, AI spending expectations, margins, and growth-stock sentiment.",
    related_companies: ["Apple", "Microsoft", "Nvidia", "Amazon", "Meta", "Alphabet"],
    related_etfs: ["QQQ", "XLK"],
    related_sectors: ["Technology", "Communication services", "Consumer discretionary"],
    market_classification: "neutral",
    market_impact_score: 64,
    confidence_score: 70,
    short_term_impact: "Options and earnings positioning may drive short-term volatility in tech stocks.",
    medium_term_impact: "Guidance could reshape expectations for AI capex and software/cloud growth over several weeks.",
    risk_factors: ["Weak guidance", "Margin compression", "AI spending disappointment"],
    alternative_scenario: "If earnings beat expectations and guidance improves, the impact could become broadly bullish.",
    beginner_explanation: "Big technology firms are large parts of major indexes, so their earnings can move the whole market.",
    impact_generated_at: new Date().toISOString(),
    impact_model: "mock-impact-fallback"
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
    created_time: new Date().toISOString(),
    short_summary: "Energy, banks, crypto, and commodities are active as Treasury yields move.",
    why_it_matters_financially: "Yield moves affect bank profitability, risk appetite, commodity-linked equities, and valuation assumptions.",
    related_companies: ["Exxon Mobil", "JPMorgan Chase"],
    related_etfs: ["XLE", "XLF", "IWM"],
    related_sectors: ["Energy", "Financials", "Crypto", "Commodities"],
    market_classification: "neutral",
    market_impact_score: 61,
    confidence_score: 68,
    short_term_impact: "Cross-asset moves could create quick rotation between banks, energy, and smaller companies.",
    medium_term_impact: "Sustained yield changes could alter sector leadership across financials, energy, and cyclicals.",
    risk_factors: ["Oil price shock", "Bank credit stress", "Crypto risk-off move"],
    alternative_scenario: "If yields stabilize and oil remains firm, energy and financials could outperform.",
    beginner_explanation: "Interest rates influence many asset classes, so a move in yields can ripple through several sectors.",
    impact_generated_at: new Date().toISOString(),
    impact_model: "mock-impact-fallback"
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
    related_companies: article.related_companies ? Array.from(new Set(article.related_companies)) : [],
    related_etfs: article.related_etfs ? Array.from(new Set(article.related_etfs.map((ticker) => ticker.toUpperCase()))) : [],
    related_sectors: article.related_sectors ? Array.from(new Set(article.related_sectors)) : [],
    risk_factors: article.risk_factors ? Array.from(new Set(article.risk_factors)) : [],
    created_time: article.created_time || new Date().toISOString()
  };
}
