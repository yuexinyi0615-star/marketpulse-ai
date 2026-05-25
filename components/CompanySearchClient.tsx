"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { fetchLiveQuotes, formatCurrency, formatPercent, type LiveQuote } from "@/lib/liveFinance";

export function CompanySearchClient() {
  const [query, setQuery] = useState("NVDA.US");
  const [quote, setQuote] = useState<LiveQuote | null>(null);
  const [status, setStatus] = useState("");

  async function searchCompany() {
    const symbol = query.trim();
    if (!symbol) return;

    setStatus("Loading live quote...");
    setQuote(null);

    try {
      const [result] = await fetchLiveQuotes([symbol]);
      if (!result) {
        setStatus("No live quote returned for that symbol. Try US tickers with .US, such as MSFT.US or AAPL.US.");
        return;
      }
      setQuote(result);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Company quote source could not be reached.");
    }
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-bold text-muted">
            Search live quote
            <input
              className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void searchCompany();
              }}
              placeholder="Try NVDA.US, MSFT.US, AAPL.US"
            />
          </label>
          <button className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-700" onClick={() => void searchCompany()}>
            Search
          </button>
        </div>
        <p className="mt-3 text-xs font-bold text-muted">
          This static site queries public quote CSV data from the browser. It does not store or expose secrets.
        </p>
      </Card>

      {status ? (
        <Card>
          <p className="text-sm font-bold text-muted">{status}</p>
        </Card>
      ) : null}

      {quote ? (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-muted">{quote.symbol}</p>
              <h2 className="text-3xl font-black">{formatCurrency(quote.close)}</h2>
            </div>
            <Badge tone={quote.changePercent >= 0 ? "teal" : "red"}>{formatPercent(quote.changePercent)}</Badge>
          </div>
          <dl className="mt-5 grid gap-3 text-sm md:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-bold text-muted">Open</dt>
              <dd className="mt-1 font-extrabold">{formatCurrency(quote.open)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-bold text-muted">High</dt>
              <dd className="mt-1 font-extrabold">{formatCurrency(quote.high)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-bold text-muted">Low</dt>
              <dd className="mt-1 font-extrabold">{formatCurrency(quote.low)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-bold text-muted">Volume</dt>
              <dd className="mt-1 font-extrabold">{quote.volume.toLocaleString("en-US")}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-200"
              href={`https://finance.yahoo.com/quote/${quote.symbol.replace(".US", "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Open Yahoo Finance
            </a>
            <a
              className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-200"
              href={`https://www.sec.gov/edgar/search/#/q=${quote.symbol.replace(".US", "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Search SEC
            </a>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
