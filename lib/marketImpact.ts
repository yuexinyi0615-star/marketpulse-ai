import { extractRelatedTickers, TRACKED_TICKERS, type MarketImpactAnalysis, type NewsArticle } from "@/lib/newsCollection";

const SECTOR_BY_TICKER: Record<string, string> = {
  AAPL: "Technology",
  MSFT: "Technology",
  NVDA: "Semiconductors",
  TSLA: "Consumer discretionary",
  AMZN: "Consumer discretionary",
  META: "Communication services",
  GOOGL: "Communication services",
  JPM: "Financials",
  XOM: "Energy",
  SPY: "Broad market",
  QQQ: "Technology",
  DIA: "Blue-chip industrials",
  IWM: "Small caps",
  XLK: "Technology",
  XLF: "Financials",
  XLE: "Energy",
  XLV: "Healthcare"
};

const COMPANY_BY_TICKER: Record<string, string> = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  NVDA: "Nvidia",
  TSLA: "Tesla",
  AMZN: "Amazon",
  META: "Meta Platforms",
  GOOGL: "Alphabet",
  JPM: "JPMorgan Chase",
  XOM: "Exxon Mobil"
};

const ETF_TICKERS = new Set(["SPY", "QQQ", "DIA", "IWM", "XLK", "XLF", "XLE", "XLV"]);
const EQUITY_TICKERS = new Set(TRACKED_TICKERS.filter((ticker) => !ETF_TICKERS.has(ticker)));

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseOpenAIText(payload: unknown) {
  const response = payload as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };

  if (response.output_text) return response.output_text;

  return response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("")
    .trim() ?? "";
}

export function buildFallbackImpact(article: NewsArticle): MarketImpactAnalysis {
  const text = `${article.title} ${article.raw_description}`;
  const tickers = extractRelatedTickers(text).length ? extractRelatedTickers(text) : article.related_tickers;
  const lowerText = text.toLowerCase();
  const negativeHits = ["falls", "fall", "cuts", "risk", "loss", "warning", "slump", "pressure", "miss"].filter((word) => lowerText.includes(word)).length;
  const positiveHits = ["rises", "rise", "surge", "beat", "beats", "growth", "record", "rally", "strong"].filter((word) => lowerText.includes(word)).length;
  const marketClassification = positiveHits > negativeHits ? "bullish" : negativeHits > positiveHits ? "bearish" : "neutral";
  const sectors = Array.from(new Set(tickers.map((ticker) => SECTOR_BY_TICKER[ticker]).filter(Boolean)));
  const relatedEtfs = tickers.filter((ticker) => ETF_TICKERS.has(ticker));
  const relatedCompanies = tickers.filter((ticker) => EQUITY_TICKERS.has(ticker)).map((ticker) => COMPANY_BY_TICKER[ticker] ?? ticker);
  const impactScore = clampScore(48 + tickers.length * 4 + Math.max(positiveHits, negativeHits) * 8);

  return {
    short_summary: article.title,
    why_it_matters_financially: "This article may affect investor expectations, sector rotation, and valuation assumptions for the related assets.",
    related_companies: relatedCompanies,
    related_tickers: tickers,
    related_etfs: relatedEtfs,
    related_sectors: sectors.length ? sectors : ["Broad market"],
    market_classification: marketClassification,
    market_impact_score: impactScore,
    confidence_score: 55,
    short_term_impact: "In the next 1-3 days, the article may influence sentiment and trading volume around the related tickers.",
    medium_term_impact: "Over 1-4 weeks, the impact depends on whether follow-up data confirms the article's main signal.",
    risk_factors: ["Source details may be incomplete", "Market reaction may already be priced in", "Macro data could dominate company-specific news"],
    alternative_scenario: "If investors interpret the news differently or new data contradicts it, the market impact could be muted or reverse.",
    beginner_explanation: "This news matters because investors use fresh information to update what they think a company, sector, or ETF may be worth."
  };
}

export async function analyzeArticleImpact(article: NewsArticle): Promise<{ analysis: MarketImpactAnalysis; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return {
      analysis: buildFallbackImpact(article),
      model: "mock-impact-fallback"
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: "You are a financial news impact analyst. Return only grounded analysis from the provided article. Do not invent facts. Use beginner-friendly language where requested."
        },
        {
          role: "user",
          content: JSON.stringify({
            title: article.title,
            source: article.source,
            url: article.url,
            published_time: article.published_time,
            description: article.raw_description,
            known_tickers: article.related_tickers,
            tracked_tickers: TRACKED_TICKERS
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "news_market_impact",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "short_summary",
              "why_it_matters_financially",
              "related_companies",
              "related_tickers",
              "related_etfs",
              "related_sectors",
              "market_classification",
              "market_impact_score",
              "confidence_score",
              "short_term_impact",
              "medium_term_impact",
              "risk_factors",
              "alternative_scenario",
              "beginner_explanation"
            ],
            properties: {
              short_summary: { type: "string" },
              why_it_matters_financially: { type: "string" },
              related_companies: { type: "array", items: { type: "string" } },
              related_tickers: { type: "array", items: { type: "string" } },
              related_etfs: { type: "array", items: { type: "string" } },
              related_sectors: { type: "array", items: { type: "string" } },
              market_classification: { type: "string", enum: ["bullish", "bearish", "neutral"] },
              market_impact_score: { type: "integer", minimum: 0, maximum: 100 },
              confidence_score: { type: "integer", minimum: 0, maximum: 100 },
              short_term_impact: { type: "string" },
              medium_term_impact: { type: "string" },
              risk_factors: { type: "array", items: { type: "string" } },
              alternative_scenario: { type: "string" },
              beginner_explanation: { type: "string" }
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI impact analysis returned ${response.status}`);
  }

  const payload = await response.json();
  const outputText = parseOpenAIText(payload);
  const analysis = JSON.parse(outputText) as MarketImpactAnalysis;

  return {
    analysis: {
      ...analysis,
      market_impact_score: clampScore(analysis.market_impact_score),
      confidence_score: clampScore(analysis.confidence_score),
      related_tickers: analysis.related_tickers.map((ticker) => ticker.toUpperCase()),
      related_etfs: analysis.related_etfs.map((ticker) => ticker.toUpperCase())
    },
    model
  };
}
