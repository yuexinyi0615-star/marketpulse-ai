import { findMockCompany, MOCK_COMPANIES, searchMockCompanies, type CompanyDetail, type CompanySearchResult } from "@/lib/companyData";
import type { NewsArticle } from "@/lib/newsCollection";

type FmpSearchItem = {
  symbol?: string;
  name?: string;
  exchangeShortName?: string;
  stockExchange?: string;
};

type FmpProfile = {
  symbol?: string;
  price?: number;
  beta?: number;
  volAvg?: number;
  mktCap?: number;
  lastDiv?: number;
  range?: string;
  companyName?: string;
  currency?: string;
  cik?: string;
  isin?: string;
  cusip?: string;
  exchange?: string;
  exchangeShortName?: string;
  industry?: string;
  website?: string;
  description?: string;
  ceo?: string;
  sector?: string;
  country?: string;
  fullTimeEmployees?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  dcfDiff?: number;
  dcf?: number;
  image?: string;
  ipoDate?: string;
  defaultImage?: boolean;
  isEtf?: boolean;
  isActivelyTrading?: boolean;
};

type FmpQuote = {
  symbol?: string;
  price?: number;
  changesPercentage?: number;
  change?: number;
  dayLow?: number;
  dayHigh?: number;
  yearHigh?: number;
  yearLow?: number;
  marketCap?: number;
  volume?: number;
  avgVolume?: number;
  exchange?: string;
  open?: number;
  previousClose?: number;
};

type FmpMetrics = {
  revenuePerShare?: number;
  netIncomePerShare?: number;
  peRatio?: number;
  priceToSalesRatio?: number;
  pbRatio?: number;
  enterpriseValueOverEBITDA?: number;
  freeCashFlowPerShare?: number;
  roe?: number;
  returnOnTangibleAssets?: number;
};

type FmpRatio = {
  grossProfitMargin?: number;
  operatingProfitMargin?: number;
  netProfitMargin?: number;
  returnOnEquity?: number;
  returnOnAssets?: number;
  priceEarningsRatio?: number;
  priceToSalesRatio?: number;
  priceToBookRatio?: number;
};

type FmpIncome = {
  revenue?: number;
  eps?: number;
};

type FmpCashFlow = {
  freeCashFlow?: number;
};

type FmpBalance = {
  totalDebt?: number;
};

type FmpNews = {
  symbol?: string;
  publishedDate?: string;
  publisher?: string;
  title?: string;
  site?: string;
  text?: string;
  url?: string;
};

type FmpHistorical = {
  historical?: Array<{
    close?: number;
    date?: string;
  }>;
};

function hasFmpKey() {
  return Boolean(process.env.FMP_API_KEY);
}

async function fmpFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) throw new Error("FMP_API_KEY is not configured.");

  const url = new URL(path.startsWith("http") ? path : `https://financialmodelingprep.com${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Financial Modeling Prep returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchCompanies(query: string): Promise<{ source: "fmp" | "mock"; results: CompanySearchResult[] }> {
  if (!hasFmpKey()) {
    return {
      source: "mock",
      results: searchMockCompanies(query)
    };
  }

  try {
    const [searchResults, mockMatches] = await Promise.all([
      fmpFetch<FmpSearchItem[]>("/stable/search-symbol", { query, limit: "20" }),
      Promise.resolve(searchMockCompanies(query))
    ]);

    const mapped: CompanySearchResult[] = searchResults.slice(0, 20).map((item) => ({
      symbol: item.symbol ?? "",
      name: item.name ?? item.symbol ?? "",
      exchange: item.exchangeShortName ?? item.stockExchange ?? "N/A",
      sector: "Unknown",
      industry: "Unknown",
      type: item.symbol?.includes("ETF") ? "etf" as const : "stock" as const,
      price: 0,
      marketCap: 0,
      keywords: []
    })).filter((item) => item.symbol);

    return {
      source: "fmp",
      results: mapped.length ? mapped : mockMatches
    };
  } catch {
    return {
      source: "mock",
      results: searchMockCompanies(query)
    };
  }
}

function performanceFromHistory(currentPrice: number, history: FmpHistorical | null) {
  const closes = history?.historical?.map((item) => item.close).filter((value): value is number => typeof value === "number") ?? [];
  const changeFrom = (index: number) => {
    const past = closes[index];
    if (!past || !currentPrice) return 0;
    return ((currentPrice - past) / past) * 100;
  };

  return {
    daily: changeFrom(1),
    weekly: changeFrom(5),
    monthly: changeFrom(21),
    yearly: changeFrom(252)
  };
}

function relatedEtfsForSector(sector: string, symbol: string) {
  const sectorMap: Record<string, string[]> = {
    Technology: ["QQQ", "XLK"],
    Financials: ["XLF", "DIA"],
    Energy: ["XLE", "SPY"],
    Healthcare: ["XLV", "SPY"],
    "Communication Services": ["QQQ", "SPY"],
    "Consumer Cyclical": ["QQQ", "SPY"],
    ETF: ["SPY", "QQQ"]
  };

  return Array.from(new Set([...(sectorMap[sector] ?? ["SPY"]), ...(symbol === "QQQ" ? ["XLK"] : [])]));
}

function fallbackCompanyAnalysis(company: Pick<CompanyDetail, "name" | "sector" | "industry" | "valuationRatios" | "fundamentals">) {
  return `${company.name} should be analyzed through its ${company.sector} context, ${company.industry} competitive position, valuation multiples, margin quality, cash generation, and balance-sheet risk.`;
}

export async function getCompanyDetail(symbol: string): Promise<CompanyDetail> {
  const fallback = findMockCompany(symbol);
  if (!hasFmpKey()) return fallback;

  try {
    const [
      profile,
      quote,
      metrics,
      ratios,
      income,
      cashFlow,
      balance,
      news,
      history
    ] = await Promise.all([
      fmpFetch<FmpProfile[]>(`/api/v3/profile/${symbol}`),
      fmpFetch<FmpQuote[]>(`/api/v3/quote/${symbol}`),
      fmpFetch<FmpMetrics[]>("/stable/key-metrics", { symbol, limit: "1" }),
      fmpFetch<FmpRatio[]>(`/api/v3/ratios/${symbol}`, { limit: "1" }),
      fmpFetch<FmpIncome[]>(`/api/v3/income-statement/${symbol}`, { limit: "1" }),
      fmpFetch<FmpCashFlow[]>(`/api/v3/cash-flow-statement/${symbol}`, { limit: "1" }),
      fmpFetch<FmpBalance[]>(`/api/v3/balance-sheet-statement/${symbol}`, { limit: "1" }),
      fmpFetch<FmpNews[]>("/stable/news/stock", { symbols: symbol, limit: "8" }),
      fmpFetch<FmpHistorical>(`/api/v3/historical-price-full/${symbol}`, { timeseries: "260" })
    ]);

    const profileItem = profile[0] ?? {};
    const quoteItem = quote[0] ?? {};
    const metricsItem = metrics[0] ?? {};
    const ratiosItem = ratios[0] ?? {};
    const incomeItem = income[0] ?? {};
    const cashFlowItem = cashFlow[0] ?? {};
    const balanceItem = balance[0] ?? {};
    const price = quoteItem.price ?? profileItem.price ?? fallback.price;
    const sector = profileItem.isEtf ? "ETF" : profileItem.sector ?? fallback.sector;
    const industry = profileItem.industry ?? fallback.industry;
    const relatedEtfs = relatedEtfsForSector(sector, symbol.toUpperCase());
    const latestNews: NewsArticle[] = news.slice(0, 8).map((item) => ({
      id: `${symbol}-${item.publishedDate ?? item.title}`,
      title: item.title ?? "Untitled article",
      source: item.publisher ?? item.site ?? "Financial Modeling Prep",
      url: item.url ?? "#",
      published_time: item.publishedDate ?? new Date().toISOString(),
      raw_description: item.text ?? "",
      related_tickers: [symbol.toUpperCase()],
      provider: "fmp",
      created_time: new Date().toISOString()
    }));
    const company: CompanyDetail = {
      symbol: symbol.toUpperCase(),
      name: profileItem.companyName ?? fallback.name,
      exchange: profileItem.exchangeShortName ?? quoteItem.exchange ?? fallback.exchange,
      sector,
      industry,
      type: profileItem.isEtf ? "etf" : "stock",
      price,
      marketCap: quoteItem.marketCap ?? profileItem.mktCap ?? fallback.marketCap,
      keywords: [sector, industry, symbol.toUpperCase()],
      description: profileItem.description ?? fallback.description,
      volume: quoteItem.volume ?? profileItem.volAvg ?? fallback.volume,
      fiftyTwoWeekHigh: quoteItem.yearHigh ?? fallback.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quoteItem.yearLow ?? fallback.fiftyTwoWeekLow,
      performance: performanceFromHistory(price, history),
      valuationRatios: {
        pe: ratiosItem.priceEarningsRatio ?? metricsItem.peRatio ?? null,
        ps: ratiosItem.priceToSalesRatio ?? metricsItem.priceToSalesRatio ?? null,
        pb: ratiosItem.priceToBookRatio ?? metricsItem.pbRatio ?? null,
        evToEbitda: metricsItem.enterpriseValueOverEBITDA ?? null
      },
      fundamentals: {
        revenue: incomeItem.revenue ?? null,
        eps: incomeItem.eps ?? metricsItem.netIncomePerShare ?? null,
        freeCashFlow: cashFlowItem.freeCashFlow ?? null,
        debt: balanceItem.totalDebt ?? null,
        grossMargin: ratiosItem.grossProfitMargin ?? null,
        operatingMargin: ratiosItem.operatingProfitMargin ?? null,
        netMargin: ratiosItem.netProfitMargin ?? null,
        roe: ratiosItem.returnOnEquity ?? metricsItem.roe ?? null,
        roa: ratiosItem.returnOnAssets ?? metricsItem.returnOnTangibleAssets ?? null
      },
      latestNews: latestNews.length ? latestNews : fallback.latestNews,
      relatedEtfs,
      competitors: fallback.competitors,
      aiAnalysis: fallbackCompanyAnalysis({
        name: profileItem.companyName ?? fallback.name,
        sector,
        industry,
        valuationRatios: fallback.valuationRatios,
        fundamentals: fallback.fundamentals
      }),
      technicalPlaceholder: "Technical analysis placeholder: evaluate trend, moving averages, relative strength, support/resistance, and volume confirmation.",
      fundamentalPlaceholder: "Fundamental analysis placeholder: review growth, margins, valuation, free cash flow, leverage, and return on capital.",
      learningSteps: fallback.learningSteps,
      dataSource: "fmp",
      updatedAt: new Date().toISOString()
    };

    return company;
  } catch {
    return fallback;
  }
}

export function defaultCompanyResults() {
  return MOCK_COMPANIES.map((company) => ({
    symbol: company.symbol,
    name: company.name,
    exchange: company.exchange,
    sector: company.sector,
    industry: company.industry,
    type: company.type,
    price: company.price,
    marketCap: company.marketCap,
    keywords: company.keywords
  }));
}
