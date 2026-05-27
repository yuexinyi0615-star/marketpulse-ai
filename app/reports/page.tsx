import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { listReports } from "@/lib/reportsProvider";

function miniBars(values: number[]) {
  const max = Math.max(...values.map((value) => Math.abs(value)), 1);

  return (
    <div className="mt-5 flex h-20 items-end gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className={`w-full rounded-t ${value >= 0 ? "bg-teal-500" : "bg-red-400"}`}
            style={{ height: `${Math.max(12, (Math.abs(value) / max) * 72)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export default async function ReportsPage() {
  const { source, reports } = await listReports();

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeader
            eyebrow="Reports library"
            title="Visual research reports"
            description="Daily, weekly, monthly, quarterly, annual, company, economic, sector, and prediction accuracy reports with charts, cards, and learning summaries."
          />
          <Badge tone={source === "supabase" ? "teal" : "amber"}>{source}</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Reports</p>
            <p className="mt-3 text-3xl font-black">{reports.length}</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Report types</p>
            <p className="mt-3 text-3xl font-black">10</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Generation</p>
            <p className="mt-3 text-3xl font-black">Ready</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Mode</p>
            <p className="mt-3 text-3xl font-black">{source}</p>
          </Card>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.slug}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge tone={report.generation_status === "generated" ? "teal" : "amber"}>{report.report_type}</Badge>
                  <h2 className="mt-4 text-2xl font-black">{report.title}</h2>
                </div>
                <span className="text-xs font-extrabold text-muted">{report.period_label}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{report.executive_summary}</p>
              {miniBars(report.sector_performance.map((sector) => sector.performance))}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {report.summary_stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{stat.label}</p>
                    <p className="mt-1 text-lg font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {report.related_stocks.slice(0, 4).map((ticker) => <Badge key={ticker}>{ticker}</Badge>)}
                {report.related_etfs.slice(0, 3).map((ticker) => <Badge key={ticker} tone="teal">{ticker}</Badge>)}
              </div>
              <Link className="mt-5 inline-flex rounded-lg bg-teal-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-teal-700" href={`/reports/${report.slug}`}>
                Open report
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
