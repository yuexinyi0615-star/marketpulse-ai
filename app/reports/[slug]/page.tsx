import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { LineChart } from "@/components/LineChart";
import { SectionHeader } from "@/components/SectionHeader";
import { getReport } from "@/lib/reportsProvider";
import { formatSingaporeTime } from "@/lib/time";

function SectionCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </Card>
  );
}

export default async function ReportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { source, report } = await getReport(slug);

  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <Link className="text-sm font-extrabold text-teal-700 hover:text-teal-900" href="/reports">
            Back to reports
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <SectionHeader eyebrow={report.report_type} title={report.title} description={report.executive_summary} />
            <div className="flex flex-wrap gap-2">
              <Badge tone={source === "supabase" ? "teal" : "amber"}>{source}</Badge>
              <Badge>{report.period_label}</Badge>
            </div>
          </div>
        </div>

        <Disclaimer />

        <section className="grid gap-4 md:grid-cols-3">
          {report.summary_stats.map((stat) => (
            <Card key={stat.label}>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{stat.label}</p>
              <p className="mt-3 text-3xl font-black">{stat.value}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <h2 className="text-xl font-black">Market movement chart</h2>
            <LineChart points={report.chart_points} />
          </Card>
          <Card>
            <h2 className="text-xl font-black">Sector performance</h2>
            <div className="mt-4 grid gap-3">
              {report.sector_performance.map((sector) => (
                <div key={sector.sector}>
                  <div className="flex items-center justify-between gap-3 text-sm font-bold">
                    <span>{sector.sector}</span>
                    <span className={sector.performance >= 0 ? "text-teal-700" : "text-danger"}>
                      {sector.performance >= 0 ? "+" : ""}{sector.performance.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${sector.performance >= 0 ? "bg-teal-500" : "bg-red-400"}`}
                      style={{ width: `${Math.max(8, Math.min(100, Math.abs(sector.performance) * 8))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-black">Important market movements</h2>
            <ul className="mt-4 grid gap-3">
              {report.important_market_movements.map((movement) => (
                <li key={movement} className="rounded-lg bg-slate-50 p-3 text-sm font-bold text-muted">{movement}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Top news</h2>
            <div className="mt-4 grid gap-3">
              {report.top_news.map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-50 p-3 text-sm font-bold hover:text-teal-700">
                  {item.title}
                  <span className="mt-1 block text-xs text-muted">{item.source}</span>
                </a>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Technical analysis" body={report.technical_analysis} />
          <SectionCard title="Fundamental analysis" body={report.fundamental_analysis} />
          <SectionCard title="Macro analysis" body={report.macro_analysis} />
          <SectionCard title="Sentiment analysis" body={report.sentiment_analysis} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="AI market interpretation" body={report.ai_market_interpretation} />
          <Card>
            <h2 className="text-xl font-black">Related stocks and ETFs</h2>
            <p className="mt-4 text-sm font-extrabold text-muted">Stocks</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.related_stocks.map((ticker) => <Badge key={ticker}>{ticker}</Badge>)}
            </div>
            <p className="mt-5 text-sm font-extrabold text-muted">ETFs</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.related_etfs.map((ticker) => <Badge key={ticker} tone="teal">{ticker}</Badge>)}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-xl font-black">Risks to watch</h2>
            <ul className="mt-4 grid gap-3">
              {report.risks_to_watch.map((risk) => (
                <li key={risk} className="rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-900">{risk}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xl font-black">What I should learn from this period</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{report.educational_explanation}</p>
            <ol className="mt-4 grid gap-3">
              {report.learning_takeaways.map((takeaway, index) => (
                <li key={takeaway} className="rounded-lg bg-slate-50 p-3 text-sm font-bold text-muted">
                  <span className="mr-2 text-teal-700">{index + 1}.</span>{takeaway}
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <Card>
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-black">Scheduled generation placeholder</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{report.scheduled_placeholder}</p>
              <p className="mt-2 text-xs font-bold text-muted">Updated {formatSingaporeTime(report.updated_at)}</p>
            </div>
            <Badge tone="amber">{report.generation_status}</Badge>
          </div>
        </Card>

        <aside className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong className="font-extrabold">Report disclaimer:</strong> {report.disclaimer}
        </aside>
      </div>
    </AppShell>
  );
}
