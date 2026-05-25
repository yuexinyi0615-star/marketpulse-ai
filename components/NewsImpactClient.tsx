"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/SectionHeader";
import { MOCK_NEWS_ARTICLES, NEWS_TOPICS, TRACKED_TICKERS, type NewsArticle } from "@/lib/newsCollection";

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
  articles: NewsArticle[];
  error?: string;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function sourceTone(source: string): "teal" | "amber" | "slate" {
  if (source === "supabase") return "teal";
  if (source.includes("mock")) return "amber";
  return "slate";
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
      setStatus(`Fetched ${payload.count} from ${payload.provider}; stored ${payload.stored} in ${payload.storage}.`);
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
        eyebrow="Daily financial news collection"
        title="News Impact Page"
        description="Server routes collect financial news from NewsAPI or Financial Modeling Prep, store normalized articles in Supabase, and fall back safely when credentials are missing."
      />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={sourceTone(source)}>{source}</Badge>
              <Badge tone="teal">Server-side API</Badge>
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
                <Badge tone={article.provider === "mock" ? "amber" : "teal"}>{article.provider ?? source}</Badge>
                <span className="text-xs font-extrabold text-muted">{formatTime(article.published_time)}</span>
              </div>
              <h3 className="mt-3 text-lg font-black leading-snug">
                <a href={article.url} target="_blank" rel="noreferrer" className="hover:text-teal-700">
                  {article.title}
                </a>
              </h3>
              <p className="mt-2 text-sm font-bold text-muted">{article.source}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{article.raw_description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.related_tickers.length ? (
                  article.related_tickers.map((ticker) => <Badge key={ticker}>{ticker}</Badge>)
                ) : (
                  <Badge>No matched ticker</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
