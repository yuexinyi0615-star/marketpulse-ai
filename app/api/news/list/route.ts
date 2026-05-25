import { NextRequest, NextResponse } from "next/server";
import { MOCK_NEWS_ARTICLES } from "@/lib/newsCollection";
import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;
  const ticker = request.nextUrl.searchParams.get("ticker")?.toUpperCase();
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    const articles = ticker
      ? MOCK_NEWS_ARTICLES.filter((article) => article.related_tickers.includes(ticker))
      : MOCK_NEWS_ARTICLES;

    return NextResponse.json({
      ok: true,
      source: "mock-fallback",
      articles: articles.slice(0, limit)
    });
  }

  let query = supabase
    .from("news_articles")
    .select("id,title,source,url,published_time,raw_description,related_tickers,provider,created_time,short_summary,why_it_matters_financially,related_companies,related_etfs,related_sectors,market_classification,market_impact_score,confidence_score,short_term_impact,medium_term_impact,risk_factors,alternative_scenario,beginner_explanation,impact_generated_at,impact_model")
    .order("published_time", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (ticker) {
    query = query.contains("related_tickers", [ticker]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        articles: MOCK_NEWS_ARTICLES.slice(0, limit)
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    source: "supabase",
    articles: data ?? []
  });
}
