"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { formatCurrencyCompact, type CompanySearchResult } from "@/lib/companyData";

type SearchResponse = {
  ok: boolean;
  source: "fmp" | "mock";
  results: CompanySearchResult[];
  error?: string;
};

export function CompanySearchClient() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"fmp" | "mock">("mock");
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [status, setStatus] = useState("Loading company universe...");

  async function searchCompany(nextQuery = query) {
    setStatus("Searching companies, ETFs, sectors, and keywords...");

    try {
      const response = await fetch(`/api/company/search?q=${encodeURIComponent(nextQuery)}`, { cache: "no-store" });
      const payload = await response.json() as SearchResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? `Search returned ${response.status}`);
      }

      setSource(payload.source);
      setResults(payload.results);
      setStatus(payload.results.length ? `Showing ${payload.results.length} results from ${payload.source}.` : "No matching companies found.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Company search failed.");
      setResults([]);
    }
  }

  useEffect(() => {
    void searchCompany("");
  }, []);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-bold text-muted">
            Search ticker, company, sector, industry, ETF, or keyword
            <input
              className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void searchCompany();
              }}
              placeholder="Try NVDA, Apple, banking sector, ETF, AI, energy"
            />
          </label>
          <button className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-700" onClick={() => void searchCompany()}>
            Search
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={source === "fmp" ? "teal" : "amber"}>{source}</Badge>
          <Badge tone="slate">Server-side FMP</Badge>
          <Badge tone="slate">Mock fallback</Badge>
        </div>
        <p className="mt-3 text-xs font-bold text-muted">{status}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((company) => (
          <Card key={company.symbol}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-muted">{company.symbol} · {company.exchange}</p>
                <h2 className="text-2xl font-black">{company.name}</h2>
              </div>
              <Badge tone={company.type === "etf" ? "amber" : "teal"}>{company.type.toUpperCase()}</Badge>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-bold text-muted">Sector</dt>
                <dd className="mt-1 font-extrabold">{company.sector}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-bold text-muted">Industry</dt>
                <dd className="mt-1 font-extrabold">{company.industry}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-bold text-muted">Price</dt>
                <dd className="mt-1 font-extrabold">{company.price ? formatCurrencyCompact(company.price) : "Open detail"}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-bold text-muted">Market cap</dt>
                <dd className="mt-1 font-extrabold">{company.marketCap ? formatCurrencyCompact(company.marketCap) : "N/A"}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {company.keywords.slice(0, 4).map((keyword) => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </div>
            <Link
              className="mt-5 inline-flex rounded-lg bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-200"
              href={`/company/${company.symbol}`}
            >
              Open company detail
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
