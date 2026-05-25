import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/SectionHeader";
import { formatCurrencyCompact, formatNumber, formatPercentValue } from "@/lib/companyData";
import { getCompanyDetail } from "@/lib/companyProviders";
import { formatSingaporeTime } from "@/lib/time";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs font-extrabold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-black">{value}</dd>
    </div>
  );
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const company = await getCompanyDetail(symbol);

  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <Link className="text-sm font-extrabold text-teal-700 hover:text-teal-900" href="/company-search">
            Back to company search
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <SectionHeader
              eyebrow={`${company.symbol} · ${company.exchange}`}
              title={company.name}
              description={company.description}
            />
            <div className="flex flex-wrap gap-2">
              <Badge tone={company.dataSource === "fmp" ? "teal" : "amber"}>{company.dataSource}</Badge>
              <Badge>{company.type.toUpperCase()}</Badge>
            </div>
          </div>
        </div>

        <Disclaimer />

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Price</p>
            <p className="mt-3 text-3xl font-black">{formatCurrencyCompact(company.price)}</p>
            <p className="mt-1 text-sm font-bold text-muted">Updated {formatSingaporeTime(company.updatedAt)}</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Market cap</p>
            <p className="mt-3 text-3xl font-black">{formatCurrencyCompact(company.marketCap)}</p>
            <p className="mt-1 text-sm font-bold text-muted">{company.sector}</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Volume</p>
            <p className="mt-3 text-3xl font-black">{formatNumber(company.volume, { notation: "compact" })}</p>
            <p className="mt-1 text-sm font-bold text-muted">Daily trading volume</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">52-week range</p>
            <p className="mt-3 text-2xl font-black">{formatCurrencyCompact(company.fiftyTwoWeekLow)} - {formatCurrencyCompact(company.fiftyTwoWeekHigh)}</p>
            <p className="mt-1 text-sm font-bold text-muted">High and low</p>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card>
            <h2 className="text-xl font-black">Company overview</h2>
            <dl className="mt-5 grid gap-3 md:grid-cols-2">
              <Metric label="Ticker" value={company.symbol} />
              <Metric label="Exchange" value={company.exchange} />
              <Metric label="Sector" value={company.sector} />
              <Metric label="Industry" value={company.industry} />
            </dl>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Performance</h2>
            <dl className="mt-5 grid gap-3 md:grid-cols-2">
              <Metric label="Daily" value={formatPercentValue(company.performance.daily)} />
              <Metric label="Weekly" value={formatPercentValue(company.performance.weekly)} />
              <Metric label="Monthly" value={formatPercentValue(company.performance.monthly)} />
              <Metric label="Yearly" value={formatPercentValue(company.performance.yearly)} />
            </dl>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-xl font-black">Valuation ratios</h2>
            <dl className="mt-5 grid gap-3 md:grid-cols-2">
              <Metric label="P/E" value={formatNumber(company.valuationRatios.pe, { maximumFractionDigits: 2 })} />
              <Metric label="P/S" value={formatNumber(company.valuationRatios.ps, { maximumFractionDigits: 2 })} />
              <Metric label="P/B" value={formatNumber(company.valuationRatios.pb, { maximumFractionDigits: 2 })} />
              <Metric label="EV/EBITDA" value={formatNumber(company.valuationRatios.evToEbitda, { maximumFractionDigits: 2 })} />
            </dl>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Fundamentals</h2>
            <dl className="mt-5 grid gap-3 md:grid-cols-3">
              <Metric label="Revenue" value={formatCurrencyCompact(company.fundamentals.revenue)} />
              <Metric label="EPS" value={formatNumber(company.fundamentals.eps, { maximumFractionDigits: 2 })} />
              <Metric label="Free cash flow" value={formatCurrencyCompact(company.fundamentals.freeCashFlow)} />
              <Metric label="Debt" value={formatCurrencyCompact(company.fundamentals.debt)} />
              <Metric label="Gross margin" value={company.fundamentals.grossMargin === null ? "N/A" : formatPercentValue(company.fundamentals.grossMargin * 100)} />
              <Metric label="Operating margin" value={company.fundamentals.operatingMargin === null ? "N/A" : formatPercentValue(company.fundamentals.operatingMargin * 100)} />
              <Metric label="Net margin" value={company.fundamentals.netMargin === null ? "N/A" : formatPercentValue(company.fundamentals.netMargin * 100)} />
              <Metric label="ROE" value={company.fundamentals.roe === null ? "N/A" : formatPercentValue(company.fundamentals.roe * 100)} />
              <Metric label="ROA" value={company.fundamentals.roa === null ? "N/A" : formatPercentValue(company.fundamentals.roa * 100)} />
            </dl>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <h2 className="text-xl font-black">AI analysis</h2>
            <p className="mt-4 text-sm leading-6 text-muted">{company.aiAnalysis}</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Technical analysis placeholder</p>
                <p className="mt-2 text-sm leading-6 text-muted">{company.technicalPlaceholder}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Fundamental analysis placeholder</p>
                <p className="mt-2 text-sm leading-6 text-muted">{company.fundamentalPlaceholder}</p>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Related ETFs and competitors</h2>
            <p className="mt-4 text-sm font-extrabold text-muted">Related ETFs</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {company.relatedEtfs.map((ticker) => <Badge key={ticker} tone="teal">{ticker}</Badge>)}
            </div>
            <p className="mt-5 text-sm font-extrabold text-muted">Competitors</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {company.competitors.map((ticker) => <Badge key={ticker}>{ticker}</Badge>)}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <h2 className="text-xl font-black">Latest news</h2>
            <div className="mt-4 grid gap-3">
              {company.latestNews.length ? company.latestNews.map((article) => (
                <article key={article.url} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <a href={article.url} target="_blank" rel="noreferrer" className="font-extrabold hover:text-teal-700">{article.title}</a>
                  <p className="mt-2 text-xs font-bold text-muted">{article.source} · {formatSingaporeTime(article.published_time)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{article.raw_description}</p>
                </article>
              )) : <p className="text-sm font-bold text-muted">No latest news returned for this company yet.</p>}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black">How to analyze this company</h2>
            <ol className="mt-4 grid gap-3">
              {company.learningSteps.map((step, index) => (
                <li key={step} className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-muted">
                  <span className="mr-2 text-teal-700">{index + 1}.</span>{step}
                </li>
              ))}
            </ol>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
