"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/SectionHeader";
import { MOCK_NEWS_ARTICLES, NEWS_TOPICS, TRACKED_TICKERS, type NewsArticle } from "@/lib/newsCollection";
import { formatSingaporeTime } from "@/lib/time";

type ListResponse = {
  ok: boolean;
  source: string;
  articles: NewsArticle[];
  error?: string;
};

type FetchResponse = {
  ok: boolean;
  provider: string;
  count: number;
  stored: number;
  storage: string;
  impact_analyzed: number;
  impact_stored: number;
  articles: NewsArticle[];
  error?: string;
};

function sourceTone(source: string): "teal" | "amber" | "slate" {
  if (source === "supabase") return "teal";
  if (source.includes("mock")) return "amber";
  return "slate";
}

function classificationTone(classification: NewsArticle["market_classification"]): "teal" | "amber" | "red" | "slate" {
  if (classification === "bullish") return "teal";
  if (classification === "bearish") return "red";
  if (classification === "neutral") return "amber";
  return "slate";
}

function impactScoreTone(score: number | null | undefined) {
  if (!score) return "bg-slate-300";
  if (score >= 70) return "bg-teal-600";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function MarketImpactGauge({ score }: { score: number | null | undefined }) {
  const normalizedScore = Math.max(0, Math.min(100, score ?? 0));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-wider text-muted">
        <span>MarketImpactScore</span>
        <span>{score ?? "--"}/100</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-slate-100">
        <div className={`h-3 rounded-full ${impactScoreTone(score)}`} style={{ width: `${normalizedScore}%` }} />
      </div>
    </div>
  );
}

export function NewsImpactClient() {
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_NEWS_ARTICLES);
  const [source, setSource] = useState("mock-fallback");
  const [status, setStatus] = useState("Loading collected articles...");
  const [loading, setLoading] = useState(true);

  const loadArticles = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/news/list?limit=60", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`List API returned ${response.status}`);
      }

      const payload = await response.json() as ListResponse;
      setArticles(payload.articles.length ? payload.articles : MOCK_NEWS_ARTICLES);
      setSource(payload.source);
      setStatus(payload.error ?? `Showing ${payload.articles.length} collected articles.`);
    } catch (error) {
      setArticles(MOCK_NEWS_ARTICLES);
      setSource("mock-fallback");
      setStatus(error instanceof Error ? `${error.message}. Showing mock fallback articles.` : "Showing mock fallback articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function fetchDailyNews() {
    setLoading(true);
    setStatus("Fetching daily financial news on the server...");

    try {
      const response = await fetch("/api/news/fetch", {
        method: "POST",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Fetch API returned ${response.status}`);
      }

      const payload = await response.json() as FetchResponse;
      setStatus(
        `Fetched ${payload.count} from ${payload.provider}; stored ${payload.stored} in ${payload.storage}; analyzed ${payload.impact_analyzed} impact records.`
      );
      await loadArticles();
    } catch (error) {
      setSource("mock-fallback");
      setArticles(MOCK_NEWS_ARTICLES);
      setStatus(error instanceof Error ? `${error.message}. Showing mock fallback articles.` : "Showing mock fallback articles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  return (
    <div className="grid gap-6">
      <SectionHeader
        eyebrow="News-to-market impact engine"
        title="News Impact Page"
        description="Server routes collect financial news, use OpenAI to generate structured market impact analysis, store results in Supabase, and fall back safely when credentials are missing."
      />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={sourceTone(source)}>{source}</Badge>
              <Badge tone="teal">Server-side API</Badge>
              <Badge tone="slate">OpenAI impact engine</Badge>
              <Badge tone="slate">Supabase storage</Badge>
            </div>
            <p className="mt-3 text-sm font-bold text-muted">{status}</p>
          </div>
          <button
            className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={() => void fetchDailyNews()}
            disabled={loading}
          >
            {loading ? "Working..." : "Fetch daily news"}
          </button>
        </div>
      </Card>

      <Disclaimer />

      <section>
        <SectionHeader eyebrow="Collection scope" title="Tracked market themes and tickers" />
        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <Card>
            <div className="flex flex-wrap gap-2">
              {NEWS_TOPICS.slice(0, 11).map((topic) => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex flex-wrap gap-2">
              {TRACKED_TICKERS.map((ticker) => (
                <Badge key={ticker} tone="teal">{ticker}</Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Collected articles</h2>
          <Badge tone={sourceTone(source)}>{articles.length} articles</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.url}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={classificationTone(article.market_classification)}>
                    {article.market_classification ?? "unscored"}
                  </Badge>
                  <Badge tone={article.provider === "mock" ? "amber" : "teal"}>{article.provider ?? source}</Badge>
                </div>
                <span className="text-xs font-extrabold text-muted">{formatSingaporeTime(article.published_time)}</span>
              </div>
              <h3 className="mt-3 text-lg font-black leading-snug">
                <a href={article.url} target="_blank" rel="noreferrer" className="hover:text-teal-700">
                  {article.title}
                </a>
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
                <span>{article.source}</span>
                <a href={article.url} target="_blank" rel="noreferrer" className="text-teal-700 hover:text-teal-900">
                  Source link
                </a>
              </div>
              <div className="mt-5">
                <MarketImpactGauge score={article.market_impact_score} />
              </div>
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Summary</p>
                <p className="mt-2 text-sm leading-6 text-slate-800">{article.short_summary ?? article.raw_description}</p>
              </div>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="font-bold text-muted">Confidence</dt>
                  <dd className="mt-1 text-xl font-black">{article.confidence_score ?? "--"}%</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="font-bold text-muted">Sector</dt>
                  <dd className="mt-1 font-extrabold">{article.related_sectors?.join(", ") || "Not classified"}</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Why it matters</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{article.why_it_matters_financially ?? "Impact analysis has not been generated yet."}</p>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Short explanation</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{article.beginner_explanation ?? article.raw_description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.related_tickers.length ? (
                  article.related_tickers.map((ticker) => <Badge key={ticker}>{ticker}</Badge>)
                ) : (
                  <Badge>No matched ticker</Badge>
                )}
                {article.related_etfs?.map((ticker) => <Badge key={ticker} tone="teal">{ticker}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
