import type { NewsArticle } from "@/lib/newsCollection";

export type CompanySearchResult = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  type: "stock" | "etf";
  price: number;
  marketCap: number;
  keywords: string[];
};

export type CompanyDetail = CompanySearchResult & {
  description: string;
  volume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  valuationRatios: {
    pe: number | null;
    ps: number | null;
    pb: number | null;
    evToEbitda: number | null;
  };
  fundamentals: {
    revenue: number | null;
    eps: number | null;
    freeCashFlow: number | null;
    debt: number | null;
    grossMargin: number | null;
    operatingMargin: number | null;
    netMargin: number | null;
    roe: number | null;
    roa: number | null;
  };
  latestNews: NewsArticle[];
  relatedEtfs: string[];
  competitors: string[];
  aiAnalysis: string;
  technicalPlaceholder: string;
  fundamentalPlaceholder: string;
  learningSteps: string[];
  dataSource: "fmp" | "mock";
  updatedAt: string;
};

export const MOCK_COMPANIES: CompanyDetail[] = [
  {
    symbol: "NVDA",
    name: "Nvidia Corporation",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    type: "stock",
    price: 138.42,
    marketCap: 3400000000000,
    keywords: ["AI", "semiconductors", "GPU", "data center", "technology stocks"],
    description: "Nvidia designs GPUs, accelerated computing platforms, and AI infrastructure used across gaming, data centers, automotive, and enterprise workloads.",
    volume: 208000000,
    fiftyTwoWeekHigh: 153.13,
    fiftyTwoWeekLow: 86.62,
    performance: { daily: 1.8, weekly: 4.6, monthly: 9.4, yearly: 78.2 },
    valuationRatios: { pe: 48.6, ps: 27.4, pb: 41.2, evToEbitda: 39.8 },
    fundamentals: {
      revenue: 130500000000,
      eps: 2.94,
      freeCashFlow: 60800000000,
      debt: 10500000000,
      grossMargin: 0.75,
      operatingMargin: 0.61,
      netMargin: 0.55,
      roe: 0.92,
      roa: 0.58
    },
    latestNews: [
      {
        id: "mock-nvda-news",
        title: "AI infrastructure demand keeps semiconductor leaders in focus",
        source: "MarketPulse Sample",
        url: "https://example.com/nvda-ai-demand",
        published_time: new Date().toISOString(),
        raw_description: "Sample news item for Nvidia and AI infrastructure.",
        related_tickers: ["NVDA", "QQQ", "XLK"],
        provider: "mock",
        created_time: new Date().toISOString()
      }
    ],
    relatedEtfs: ["QQQ", "XLK", "SMH"],
    competitors: ["AMD", "AVGO", "INTC"],
    aiAnalysis: "Nvidia remains a high-quality growth story tied to AI infrastructure, but expectations are demanding and valuation leaves little room for disappointment.",
    technicalPlaceholder: "Technical analysis placeholder: compare price versus 20-day and 50-day moving averages, volume confirmation, support, and resistance.",
    fundamentalPlaceholder: "Fundamental analysis placeholder: monitor data center growth, gross margin durability, customer concentration, and capex cycle exposure.",
    learningSteps: ["Start with revenue mix by segment.", "Compare margins to semiconductor peers.", "Check valuation against growth expectations.", "Read recent earnings guidance and risk factors."],
    dataSource: "mock",
    updatedAt: new Date().toISOString()
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Consumer Electronics",
    type: "stock",
    price: 203.65,
    marketCap: 3100000000000,
    keywords: ["iPhone", "services", "consumer electronics", "technology stocks"],
    description: "Apple designs consumer devices, software, and services, with major revenue from iPhone, Mac, iPad, wearables, and recurring services.",
    volume: 57300000,
    fiftyTwoWeekHigh: 237.49,
    fiftyTwoWeekLow: 164.08,
    performance: { daily: 0.4, weekly: 1.1, monthly: 3.2, yearly: 8.9 },
    valuationRatios: { pe: 30.9, ps: 7.9, pb: 44.5, evToEbitda: 23.1 },
    fundamentals: {
      revenue: 391000000000,
      eps: 6.58,
      freeCashFlow: 108800000000,
      debt: 98000000000,
      grossMargin: 0.46,
      operatingMargin: 0.31,
      netMargin: 0.24,
      roe: 1.38,
      roa: 0.29
    },
    latestNews: [
      {
        id: "mock-aapl-news",
        title: "Apple services growth remains central to long-term margin outlook",
        source: "MarketPulse Sample",
        url: "https://example.com/aapl-services-growth",
        published_time: new Date().toISOString(),
        raw_description: "Sample news item for Apple services and margin analysis.",
        related_tickers: ["AAPL", "QQQ", "XLK"],
        provider: "mock",
        created_time: new Date().toISOString()
      }
    ],
    relatedEtfs: ["QQQ", "XLK", "SPY"],
    competitors: ["MSFT", "GOOGL", "Samsung"],
    aiAnalysis: "Apple is a mature compounder with strong cash generation. The key debate is whether services growth and ecosystem retention can offset hardware cycle softness.",
    technicalPlaceholder: "Technical analysis placeholder: watch whether price holds above prior breakout levels and whether volume confirms momentum.",
    fundamentalPlaceholder: "Fundamental analysis placeholder: focus on services margin, iPhone replacement cycle, buybacks, and China demand.",
    learningSteps: ["Separate hardware and services revenue.", "Track gross margin trend.", "Review capital return and free cash flow.", "Compare valuation to growth."],
    dataSource: "mock",
    updatedAt: new Date().toISOString()
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    sector: "Financials",
    industry: "Banks - Diversified",
    type: "stock",
    price: 257.14,
    marketCap: 720000000000,
    keywords: ["banking sector", "interest rates", "credit", "financials"],
    description: "JPMorgan Chase is a diversified global bank with consumer banking, investment banking, commercial banking, asset management, and trading operations.",
    volume: 9400000,
    fiftyTwoWeekHigh: 280.25,
    fiftyTwoWeekLow: 190.90,
    performance: { daily: -0.3, weekly: 0.8, monthly: 4.1, yearly: 24.5 },
    valuationRatios: { pe: 13.4, ps: 4.3, pb: 2.1, evToEbitda: null },
    fundamentals: {
      revenue: 177000000000,
      eps: 19.2,
      freeCashFlow: 52000000000,
      debt: 430000000000,
      grossMargin: null,
      operatingMargin: 0.43,
      netMargin: 0.31,
      roe: 0.17,
      roa: 0.014
    },
    latestNews: [
      {
        id: "mock-jpm-news",
        title: "Banks trade around credit quality and interest-rate expectations",
        source: "MarketPulse Sample",
        url: "https://example.com/jpm-bank-credit",
        published_time: new Date().toISOString(),
        raw_description: "Sample news item for JPMorgan and banking-sector analysis.",
        related_tickers: ["JPM", "XLF"],
        provider: "mock",
        created_time: new Date().toISOString()
      }
    ],
    relatedEtfs: ["XLF", "DIA", "SPY"],
    competitors: ["BAC", "WFC", "C"],
    aiAnalysis: "JPMorgan has scale, diversified revenue, and strong profitability. Investors should watch net interest income, credit losses, and capital requirements.",
    technicalPlaceholder: "Technical analysis placeholder: compare bank price action with XLF and Treasury yield moves.",
    fundamentalPlaceholder: "Fundamental analysis placeholder: review CET1 capital, deposit costs, loan growth, and credit provisions.",
    learningSteps: ["Review net interest income.", "Study credit-loss provisions.", "Compare ROE to peers.", "Watch capital requirements and buybacks."],
    dataSource: "mock",
    updatedAt: new Date().toISOString()
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    exchange: "NASDAQ",
    sector: "ETF",
    industry: "Large-cap growth ETF",
    type: "etf",
    price: 456.8,
    marketCap: 0,
    keywords: ["ETF", "Nasdaq", "technology stocks", "growth"],
    description: "QQQ tracks the Nasdaq-100 Index, providing exposure to large non-financial companies with heavy technology and growth concentration.",
    volume: 42000000,
    fiftyTwoWeekHigh: 476.2,
    fiftyTwoWeekLow: 342.35,
    performance: { daily: 0.9, weekly: 2.4, monthly: 6.8, yearly: 31.7 },
    valuationRatios: { pe: 32.5, ps: null, pb: null, evToEbitda: null },
    fundamentals: {
      revenue: null,
      eps: null,
      freeCashFlow: null,
      debt: null,
      grossMargin: null,
      operatingMargin: null,
      netMargin: null,
      roe: null,
      roa: null
    },
    latestNews: [],
    relatedEtfs: ["XLK", "SPY"],
    competitors: ["SPY", "XLK", "IWM"],
    aiAnalysis: "QQQ is a concentrated growth ETF. It is sensitive to megacap earnings, Treasury yields, and AI spending expectations.",
    technicalPlaceholder: "Technical analysis placeholder: compare QQQ trend strength against SPY and check breadth among top holdings.",
    fundamentalPlaceholder: "Fundamental analysis placeholder: review index concentration, sector weights, and weighted valuation.",
    learningSteps: ["Identify top holdings.", "Check sector concentration.", "Compare performance versus SPY.", "Watch interest-rate sensitivity."],
    dataSource: "mock",
    updatedAt: new Date().toISOString()
  }
];

export function findMockCompany(symbol: string) {
  return MOCK_COMPANIES.find((company) => company.symbol.toLowerCase() === symbol.toLowerCase()) ?? MOCK_COMPANIES[0];
}

export function searchMockCompanies(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return MOCK_COMPANIES;

  return MOCK_COMPANIES.filter((company) => {
    const fields = [
      company.symbol,
      company.name,
      company.sector,
      company.industry,
      company.type,
      company.description,
      ...company.keywords
    ];

    return fields.some((field) => field.toLowerCase().includes(normalized));
  });
}

export function formatNumber(value: number | null | undefined, options?: Intl.NumberFormatOptions) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatCurrencyCompact(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercentValue(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
