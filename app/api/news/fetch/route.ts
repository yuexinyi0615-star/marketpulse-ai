import { NextResponse } from "next/server";
import { MOCK_NEWS_ARTICLES, type NewsArticle } from "@/lib/newsCollection";
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

async function persistArticles(articles: NewsArticle[]) {
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    return {
      stored: 0,
      storage: "mock-fallback"
    };
  }

  const rows = articles.map((article) => ({
    title: article.title,
    source: article.source,
    url: article.url,
    published_time: article.published_time,
    raw_description: article.raw_description,
    related_tickers: article.related_tickers,
    provider: article.provider ?? "unknown",
    created_time: article.created_time
  }));

  const { data, error } = await supabase
    .from("news_articles")
    .upsert(rows, { onConflict: "url", ignoreDuplicates: false })
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  return {
    stored: data?.length ?? 0,
    storage: "supabase"
  };
}

export async function GET() {
  try {
    const { provider, articles } = await collectArticles();
    const persistence = provider === "mock" ? { stored: 0, storage: "mock-fallback" } : await persistArticles(articles);

    return NextResponse.json({
      ok: true,
      provider,
      count: articles.length,
      ...persistence,
      articles: articles.slice(0, 20)
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
