"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import type { DailyMarketUpdateResult } from "@/lib/dailyMarketUpdate";
import { formatSingaporeTime } from "@/lib/time";

function toneForStatus(status: string): "teal" | "amber" | "red" | "slate" {
  if (status === "success") return "teal";
  if (status === "error") return "red";
  if (status === "working") return "amber";
  return "slate";
}

export function AdminMarketUpdateClient() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Enter the server CRON secret locally, then run a manual refresh.");
  const [result, setResult] = useState<DailyMarketUpdateResult | null>(null);

  async function runManualRefresh() {
    setStatus("working");
    setMessage("Running daily market update...");
    setResult(null);

    try {
      const response = await fetch("/api/cron/daily-market-update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`
        },
        cache: "no-store"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? `Manual refresh returned ${response.status}`);
      }

      setResult(payload as DailyMarketUpdateResult);
      setStatus("success");
      setMessage("Daily market update completed.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Manual refresh failed.");
    }
  }

  return (
    <div className="grid gap-6">
      <SectionHeader
        eyebrow="Admin"
        title="Daily market update"
        description="Manually trigger the secure Vercel cron route. Times are displayed in Singapore time."
      />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="grid gap-2 text-sm font-bold text-muted">
            CRON secret
            <input
              className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600"
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Enter CRON_SECRET"
              autoComplete="off"
            />
          </label>
          <button
            className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={() => void runManualRefresh()}
            disabled={status === "working" || !secret}
          >
            {status === "working" ? "Refreshing..." : "Run manual refresh"}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={toneForStatus(status)}>{status}</Badge>
          <Badge tone="slate">Scheduled 06:30 SGT, Tue-Sat</Badge>
          <Badge tone="slate">22:30 UTC, Mon-Fri</Badge>
        </div>
        <p className="mt-3 text-sm font-bold text-muted">{message}</p>
      </Card>

      {result ? (
        <div className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Articles fetched</p>
              <p className="mt-3 text-3xl font-black">{result.articles_fetched}</p>
            </Card>
            <Card>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Articles stored</p>
              <p className="mt-3 text-3xl font-black">{result.articles_stored}</p>
            </Card>
            <Card>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Analyses created</p>
              <p className="mt-3 text-3xl font-black">{result.analyses_created}</p>
            </Card>
            <Card>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Outlook saved</p>
              <p className="mt-3 text-3xl font-black">{result.outlook_created ? "Yes" : "No"}</p>
            </Card>
          </section>

          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Daily outlook</p>
                <h2 className="mt-2 text-2xl font-black">{result.outlook.market_tone}</h2>
              </div>
              <Badge tone="teal">{formatSingaporeTime(result.outlook.generated_at)}</Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{result.outlook.outlook_summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.outlook.watchlist.map((ticker) => (
                <Badge key={ticker}>{ticker}</Badge>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
