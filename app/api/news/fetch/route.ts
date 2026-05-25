import { NextResponse } from "next/server";
import { MOCK_NEWS_ARTICLES, type NewsArticle } from "@/lib/newsCollection";
import { analyzeArticleImpact, buildFallbackImpact } from "@/lib/marketImpact";
import { fetchFmpArticles, fetchNewsApiArticles } from "@/lib/newsProviders";
import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

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

async function persistArticles(articles: NewsArticle[]) {
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    return {
      stored: 0,
      storage: "mock-fallback",
      articles
    };
  }

  const rows = articles.map(articleToRow);

  const { data, error } = await supabase
    .from("news_articles")
    .upsert(rows, { onConflict: "url", ignoreDuplicates: false })
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
  let storedImpacts = 0;

  for (const article of articles) {
    const existingAnalysisComplete = Boolean(article.short_summary && article.market_impact_score !== null && article.market_impact_score !== undefined);
    if (existingAnalysisComplete) {
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

    const enrichedArticle: NewsArticle = {
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

    analyzed.push(enrichedArticle);

    if (supabase && hasSupabaseServerConfig && article.id) {
      const { error } = await supabase
        .from("news_articles")
        .update({
          related_tickers: enrichedArticle.related_tickers,
          short_summary: enrichedArticle.short_summary,
          why_it_matters_financially: enrichedArticle.why_it_matters_financially,
          related_companies: enrichedArticle.related_companies ?? [],
          related_etfs: enrichedArticle.related_etfs ?? [],
          related_sectors: enrichedArticle.related_sectors ?? [],
          market_classification: enrichedArticle.market_classification,
          market_impact_score: enrichedArticle.market_impact_score,
          confidence_score: enrichedArticle.confidence_score,
          short_term_impact: enrichedArticle.short_term_impact,
          medium_term_impact: enrichedArticle.medium_term_impact,
          risk_factors: enrichedArticle.risk_factors ?? [],
          alternative_scenario: enrichedArticle.alternative_scenario,
          beginner_explanation: enrichedArticle.beginner_explanation,
          impact_generated_at: enrichedArticle.impact_generated_at,
          impact_model: enrichedArticle.impact_model
        })
        .eq("id", article.id);

      if (error) {
        throw new Error(error.message);
      }

      storedImpacts += 1;
    }
  }

  return {
    analyzed,
    storedImpacts
  };
}

export async function GET() {
  try {
    const { provider, articles } = await collectArticles();
    const persistence = provider === "mock" ? { stored: 0, storage: "mock-fallback", articles } : await persistArticles(articles);
    const impact = await analyzeAndStoreArticles(persistence.articles);

    return NextResponse.json({
      ok: true,
      provider,
      count: articles.length,
      stored: persistence.stored,
      storage: persistence.storage,
      impact_analyzed: impact.analyzed.length,
      impact_stored: impact.storedImpacts,
      articles: impact.analyzed.slice(0, 20)
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to fetch financial news."
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
