"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/SectionHeader";
import {
  DEFAULT_NEWS_QUERY,
  DEFAULT_SYMBOLS,
  fetchFinancialNews,
  fetchLiveQuotes,
  formatCurrency,
  formatPercent,
  type LiveNewsItem,
  type LiveQuote
} from "@/lib/liveFinance";

type ViewMode = "home" | "market" | "news";

type LoadState = {
  quotes: LiveQuote[];
  news: LiveNewsItem[];
  loading: boolean;
  error: string;
  updatedAt: string;
};

const storageKeys = {
  symbols: "marketpulse.symbols",
  newsQuery: "marketpulse.newsQuery"
};

function toneForChange(value: number): "teal" | "amber" | "red" | "slate" {
  if (value > 0.25) return "teal";
  if (value < -0.25) return "red";
  if (value !== 0) return "amber";
  return "slate";
}

function toneForSentiment(sentiment: LiveNewsItem["sentiment"]): "teal" | "amber" | "red" {
  if (sentiment === "Positive") return "teal";
  if (sentiment === "Negative") return "red";
  return "amber";
}

function sourceTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function sparkPath(quotes: LiveQuote[]) {
  if (quotes.length === 0) return "";

  const points = quotes.map((quote, index) => {
    const x = 28 + index * (324 / Math.max(1, quotes.length - 1));
    const y = 110 - Math.max(-4, Math.min(4, quote.changePercent)) * 12;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });

  return points.join(" ");
}

function LiveQuoteChart({ quotes }: { quotes: LiveQuote[] }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <svg className="h-64 w-full" viewBox="0 0 400 180" role="img" aria-label="Live watchlist intraday change chart">
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="24" x2="370" y1={38 + line * 32} y2={38 + line * 32} stroke="#d8dee8" />
        ))}
        <line x1="24" x2="370" y1="110" y2="110" stroke="#94a3b8" strokeDasharray="5 5" />
        <path d={sparkPath(quotes)} fill="none" stroke="#0f766e" strokeLinecap="round" strokeWidth="5" />
        {quotes.map((quote, index) => {
          const x = 28 + index * (324 / Math.max(1, quotes.length - 1));
          const y = 110 - Math.max(-4, Math.min(4, quote.changePercent)) * 12;
          return <circle key={quote.symbol} cx={x} cy={y} r="5" fill="#ffffff" stroke="#0f766e" strokeWidth="3" />;
        })}
        {quotes.map((quote, index) => {
          const x = 16 + index * (324 / Math.max(1, quotes.length - 1));
          return (
            <text key={quote.symbol} x={x} y="166" fill="#687386" fontSize="11" fontWeight="700">
              {quote.symbol}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function QuoteHeatmap({ quotes }: { quotes: LiveQuote[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {quotes.map((quote) => (
        <article
          key={quote.symbol}
          className={`min-h-32 rounded-lg border p-4 ${
            quote.changePercent >= 0
              ? "border-teal-200 bg-teal-50 text-teal-950"
              : "border-red-200 bg-red-50 text-red-950"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-extrabold">{quote.symbol}</h3>
            <Badge tone={toneForChange(quote.changePercent)}>{formatPercent(quote.changePercent)}</Badge>
          </div>
          <p className="mt-6 text-3xl font-black">{formatCurrency(quote.close)}</p>
          <p className="mt-1 text-xs font-bold opacity-80">
            Open {formatCurrency(quote.open)} · Vol {quote.volume.toLocaleString("en-US")}
          </p>
        </article>
      ))}
    </div>
  );
}

export function LiveMarketDashboard({ mode = "home" }: { mode?: ViewMode }) {
  const [symbolsInput, setSymbolsInput] = useState(DEFAULT_SYMBOLS.join(" "));
  const [newsQuery, setNewsQuery] = useState(DEFAULT_NEWS_QUERY);
  const [state, setState] = useState<LoadState>({
    quotes: [],
    news: [],
    loading: true,
    error: "",
    updatedAt: ""
  });

  useEffect(() => {
    setSymbolsInput(localStorage.getItem(storageKeys.symbols) || DEFAULT_SYMBOLS.join(" "));
    setNewsQuery(localStorage.getItem(storageKeys.newsQuery) || DEFAULT_NEWS_QUERY);
  }, []);

  const symbols = useMemo(() => symbolsInput.split(/[\s,]+/).filter(Boolean), [symbolsInput]);

  const loadLiveData = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));

    const [quotesResult, newsResult] = await Promise.allSettled([fetchLiveQuotes(symbols), fetchFinancialNews(newsQuery)]);
    const quotes = quotesResult.status === "fulfilled" ? quotesResult.value : [];
    const news = newsResult.status === "fulfilled" ? newsResult.value : [];
    const errors = [quotesResult, newsResult]
      .filter((result) => result.status === "rejected")
      .map((result) => (result.status === "rejected" && result.reason instanceof Error ? result.reason.message : "A live source could not be reached."));

    localStorage.setItem(storageKeys.symbols, symbols.join(" "));
    localStorage.setItem(storageKeys.newsQuery, newsQuery);

    if (quotes.length || news.length || errors.length) {
      setState({
        quotes,
        news,
        loading: false,
        error: errors.join(" "),
        updatedAt: new Date().toLocaleString()
      });
    }
  }, [newsQuery, symbols]);

  useEffect(() => {
    void loadLiveData();
  }, [loadLiveData]);

  const averageMove = state.quotes.length
    ? state.quotes.reduce((total, quote) => total + quote.changePercent, 0) / state.quotes.length
    : 0;
  const positiveCount = state.quotes.filter((quote) => quote.changePercent >= 0).length;
  const leadHeadline = state.news[0];
  const marketTitle = mode === "news" ? "Live financial news impact" : "Live market dashboard";
  const marketDescription =
    mode === "news"
      ? "Current headlines are pulled in the browser, then scored with transparent keyword rules for classroom and research triage."
      : "Quotes and financial headlines load from public browser-accessible sources. No API key or secret is committed.";

  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Browser live data" title={marketTitle} description={marketDescription} />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label className="grid gap-2 text-sm font-bold text-muted">
            Watchlist symbols
            <input
              className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600"
              value={symbolsInput}
              onChange={(event) => setSymbolsInput(event.target.value)}
              placeholder="SPY.US QQQ.US AAPL.US MSFT.US"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-muted">
            News query
            <input
              className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600"
              value={newsQuery}
              onChange={(event) => setNewsQuery(event.target.value)}
              placeholder="stock market finance earnings when:1d"
            />
          </label>
          <button
            className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={() => void loadLiveData()}
            disabled={state.loading}
          >
            {state.loading ? "Refreshing..." : "Refresh live data"}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
          <Badge tone="teal">Chrome/browser fetch</Badge>
          <span>Quotes: Stooq CSV</span>
          <span>News: Google News RSS</span>
          {state.updatedAt ? <span>Updated {state.updatedAt}</span> : null}
        </div>
        {state.error ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
            {state.error}. If a public source blocks browser access, deploy a Supabase Edge Function or another backend proxy before using this in production.
          </p>
        ) : null}
      </Card>

      <Disclaimer />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Watchlist breadth</p>
          <p className="mt-3 text-3xl font-black">{positiveCount}/{state.quotes.length || symbols.length}</p>
          <p className="mt-1 text-sm font-bold text-muted">Symbols positive versus open</p>
        </Card>
        <Card>
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Average move</p>
          <p className="mt-3 text-3xl font-black">{formatPercent(averageMove)}</p>
          <p className="mt-1 text-sm font-bold text-muted">Current watchlist average</p>
        </Card>
        <Card>
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Headline flow</p>
          <p className="mt-3 text-3xl font-black">{state.news.length}</p>
          <p className="mt-1 text-sm font-bold text-muted">Latest RSS items loaded</p>
        </Card>
        <Card>
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Lead impact</p>
          <p className="mt-3 text-3xl font-black">{leadHeadline ? leadHeadline.impact : "--"}</p>
          <p className="mt-1 text-sm font-bold text-muted">{leadHeadline ? leadHeadline.sentiment : "Waiting for news"}</p>
        </Card>
      </section>

      {mode !== "news" ? (
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-black">Watchlist price movement</h2>
              <Badge tone="teal">Live quotes</Badge>
            </div>
            {state.quotes.length ? <LiveQuoteChart quotes={state.quotes} /> : <p className="text-sm font-bold text-muted">Loading quote chart...</p>}
          </Card>
          <Card>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-black">Market heat tiles</h2>
              <Badge tone="amber">Versus open</Badge>
            </div>
            {state.quotes.length ? <QuoteHeatmap quotes={state.quotes} /> : <p className="text-sm font-bold text-muted">Loading quote heatmap...</p>}
          </Card>
        </section>
      ) : null}

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Newest financial headlines</h2>
          <Badge tone="teal">Live RSS</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {state.news.length ? (
            state.news.map((item) => (
              <Card key={item.link}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <Badge tone={toneForSentiment(item.sentiment)}>{item.sentiment} · {item.impact}</Badge>
                  <span className="text-xs font-extrabold text-muted">{sourceTime(item.publishedAt)}</span>
                </div>
                <h3 className="mt-3 text-lg font-black leading-snug">
                  <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-teal-700">
                    {item.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm font-bold text-muted">{item.source}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.drivers.map((driver) => (
                    <Badge key={driver}>{driver}</Badge>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-sm font-bold text-muted">Loading live financial news from the browser...</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
