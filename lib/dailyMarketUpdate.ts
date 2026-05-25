import { MOCK_NEWS_ARTICLES, type DailyMarketOutlook, type NewsArticle } from "@/lib/newsCollection";
import { analyzeArticleImpact, buildFallbackImpact, parseOpenAIText } from "@/lib/marketImpact";
import { fetchFmpArticles, fetchNewsApiArticles } from "@/lib/newsProviders";
import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabaseServer";
import { formatSingaporeTime, singaporeDate } from "@/lib/time";

type PersistedArticles = {
  stored: number;
  storage: string;
  articles: NewsArticle[];
};

export type DailyMarketUpdateResult = {
  ok: boolean;
  provider: string;
  articles_fetched: number;
  articles_stored: number;
  analyses_created: number;
  analyses_stored: number;
  outlook_created: boolean;
  storage: string;
  generated_at_sgt: string;
  outlook: DailyMarketOutlook;
  articles: NewsArticle[];
};

async function collectArticles() {
  const newsApiKey = process.env.NEWSAPI_API_KEY;
  const fmpApiKey = process.env.FMP_API_KEY;

  if (newsApiKey) {
    return {
      provider: "newsapi",
      articles: await fetchNewsApiArticles(newsApiKey)
    };
  }

  if (fmpApiKey) {
    return {
      provider: "fmp",
      articles: await fetchFmpArticles(fmpApiKey)
    };
  }

  return {
    provider: "mock",
    articles: MOCK_NEWS_ARTICLES
  };
}

function articleToRow(article: NewsArticle) {
  return {
    title: article.title,
    source: article.source,
    url: article.url,
    published_time: article.published_time,
    raw_description: article.raw_description,
    related_tickers: article.related_tickers,
    provider: article.provider ?? "unknown",
    created_time: article.created_time,
    short_summary: article.short_summary,
    why_it_matters_financially: article.why_it_matters_financially,
    related_companies: article.related_companies ?? [],
    related_etfs: article.related_etfs ?? [],
    related_sectors: article.related_sectors ?? [],
    market_classification: article.market_classification,
    market_impact_score: article.market_impact_score,
    confidence_score: article.confidence_score,
    short_term_impact: article.short_term_impact,
    medium_term_impact: article.medium_term_impact,
    risk_factors: article.risk_factors ?? [],
    alternative_scenario: article.alternative_scenario,
    beginner_explanation: article.beginner_explanation,
    impact_generated_at: article.impact_generated_at,
    impact_model: article.impact_model
  };
}

async function persistArticles(articles: NewsArticle[]): Promise<PersistedArticles> {
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    return {
      stored: 0,
      storage: "mock-fallback",
      articles
    };
  }

  const { data, error } = await supabase
    .from("news_articles")
    .upsert(articles.map(articleToRow), { onConflict: "url", ignoreDuplicates: false })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return {
    stored: data?.length ?? 0,
    storage: "supabase",
    articles: data as NewsArticle[]
  };
}

async function analyzeAndStoreArticles(articles: NewsArticle[]) {
  const supabase = createSupabaseServerClient();
  const analyzed: NewsArticle[] = [];
  let created = 0;
  let stored = 0;

  for (const article of articles) {
    const complete = Boolean(article.short_summary && article.market_impact_score !== null && article.market_impact_score !== undefined);
    if (complete) {
      analyzed.push(article);
      continue;
    }

    let impactResult;
    try {
      impactResult = await analyzeArticleImpact(article);
    } catch {
      impactResult = {
        analysis: buildFallbackImpact(article),
        model: "mock-impact-fallback"
      };
    }

    const enriched: NewsArticle = {
      ...article,
      related_tickers: impactResult.analysis.related_tickers.length ? impactResult.analysis.related_tickers : article.related_tickers,
      short_summary: impactResult.analysis.short_summary,
      why_it_matters_financially: impactResult.analysis.why_it_matters_financially,
      related_companies: impactResult.analysis.related_companies,
      related_etfs: impactResult.analysis.related_etfs,
      related_sectors: impactResult.analysis.related_sectors,
      market_classification: impactResult.analysis.market_classification,
      market_impact_score: impactResult.analysis.market_impact_score,
      confidence_score: impactResult.analysis.confidence_score,
      short_term_impact: impactResult.analysis.short_term_impact,
      medium_term_impact: impactResult.analysis.medium_term_impact,
      risk_factors: impactResult.analysis.risk_factors,
      alternative_scenario: impactResult.analysis.alternative_scenario,
      beginner_explanation: impactResult.analysis.beginner_explanation,
      impact_generated_at: new Date().toISOString(),
      impact_model: impactResult.model
    };

    analyzed.push(enriched);
    created += 1;

    if (supabase && hasSupabaseServerConfig && article.id) {
      const { error } = await supabase.from("news_articles").update(articleToRow(enriched)).eq("id", article.id);

      if (error) {
        throw new Error(error.message);
      }

      stored += 1;
    }
  }

  return {
    analyzed,
    created,
    stored
  };
}

function buildFallbackOutlook(articles: NewsArticle[]): DailyMarketOutlook {
  const generatedAt = new Date().toISOString();
  const tickers = Array.from(new Set(articles.flatMap((article) => article.related_tickers).filter(Boolean))).slice(0, 12);
  const bullish = articles.filter((article) => article.market_classification === "bullish").length;
  const bearish = articles.filter((article) => article.market_classification === "bearish").length;
  const marketTone = bullish > bearish ? "bullish" : bearish > bullish ? "bearish" : "neutral";

  return {
    outlook_date: singaporeDate(),
    generated_at: generatedAt,
    market_tone: marketTone,
    outlook_summary: "Daily market outlook generated from the latest collected financial news and fallback impact analysis.",
    key_themes: Array.from(new Set(articles.flatMap((article) => article.related_sectors ?? []))).slice(0, 6),
    opportunities: ["Watch confirmed follow-through in high-impact tickers", "Compare sector reactions against Treasury yield moves"],
    risks: ["Macro data may override article-specific signals", "Market reaction may already be priced in", "Liquidity can fade after the close"],
    watchlist: tickers.length ? tickers : ["SPY", "QQQ", "DIA"],
    beginner_explanation: "This outlook summarizes the main market stories after U.S. trading and converts them into watchlist ideas for the next session.",
    source_article_ids: articles.map((article) => article.id).filter((id): id is string => typeof id === "string" && !id.startsWith("mock-")),
    model: "mock-outlook-fallback"
  };
}

async function generateDailyOutlook(articles: NewsArticle[]): Promise<DailyMarketOutlook> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return buildFallbackOutlook(articles);
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
          content: "You are a financial market strategist. Create a grounded daily market outlook from the supplied analyzed articles. Return concise JSON only."
        },
        {
          role: "user",
          content: JSON.stringify({
            singapore_date: singaporeDate(),
            articles: articles.slice(0, 20).map((article) => ({
              id: article.id,
              title: article.title,
              source: article.source,
              url: article.url,
              summary: article.short_summary,
              tickers: article.related_tickers,
              sectors: article.related_sectors,
              classification: article.market_classification,
              impact_score: article.market_impact_score,
              short_term_impact: article.short_term_impact,
              risks: article.risk_factors
            }))
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "daily_market_outlook",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["market_tone", "outlook_summary", "key_themes", "opportunities", "risks", "watchlist", "beginner_explanation"],
            properties: {
              market_tone: { type: "string", enum: ["bullish", "bearish", "neutral"] },
              outlook_summary: { type: "string" },
              key_themes: { type: "array", items: { type: "string" } },
              opportunities: { type: "array", items: { type: "string" } },
              risks: { type: "array", items: { type: "string" } },
              watchlist: { type: "array", items: { type: "string" } },
              beginner_explanation: { type: "string" }
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI daily outlook returned ${response.status}`);
  }

  const payload = await response.json();
  const parsed = JSON.parse(parseOpenAIText(payload)) as Omit<DailyMarketOutlook, "outlook_date" | "generated_at" | "source_article_ids" | "model">;

  return {
    ...parsed,
    outlook_date: singaporeDate(),
    generated_at: new Date().toISOString(),
    source_article_ids: articles.map((article) => article.id).filter((id): id is string => typeof id === "string" && !id.startsWith("mock-")),
    model
  };
}

async function persistDailyOutlook(outlook: DailyMarketOutlook) {
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    return {
      outlook,
      created: false
    };
  }

  const { data, error } = await supabase
    .from("daily_market_outlooks")
    .upsert(outlook, { onConflict: "outlook_date", ignoreDuplicates: false })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    outlook: data as DailyMarketOutlook,
    created: true
  };
}

export async function runDailyMarketUpdate(): Promise<DailyMarketUpdateResult> {
  const collected = await collectArticles();
  const persistence = collected.provider === "mock"
    ? { stored: 0, storage: "mock-fallback", articles: collected.articles }
    : await persistArticles(collected.articles);
  const impact = await analyzeAndStoreArticles(persistence.articles);
  const outlook = await persistDailyOutlook(await generateDailyOutlook(impact.analyzed));

  return {
    ok: true,
    provider: collected.provider,
    articles_fetched: collected.articles.length,
    articles_stored: persistence.stored,
    analyses_created: impact.created,
    analyses_stored: impact.stored,
    outlook_created: outlook.created,
    storage: persistence.storage,
    generated_at_sgt: formatSingaporeTime(outlook.outlook.generated_at),
    outlook: outlook.outlook,
    articles: impact.analyzed.slice(0, 20)
  };
}
