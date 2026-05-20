import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { Heatmap } from "@/components/Heatmap";
import { LineChart } from "@/components/LineChart";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { marketMetrics, newsImpacts, reports, sectorSignals, trendSeries } from "@/data/mockMarket";

const audiences = [
  {
    label: "Undergraduate students",
    description: "Guided explanations, beginner-friendly checklists, and confidence-building market vocabulary."
  },
  {
    label: "Graduate students",
    description: "Structured thesis work, evidence weighting, filing context, and research methodology prompts."
  },
  {
    label: "Professional users",
    description: "Fast signal triage, decision-ready briefs, prediction tracking, and portfolio watch workflows."
  }
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="grid gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft md:p-8">
            <Badge tone="teal">Stage 1 MVP</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-normal text-ink md:text-6xl">
              Financial research workspace from market signal to learning outcome.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              MarketPulse AI helps students and professionals interpret news, visualize market pressure, organize company research,
              and track predictions using mock data until live API keys are configured.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-700" href="/market">
                Open market dashboard
              </Link>
              <Link className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-200" href="/news-impact">
                Analyze news impact
              </Link>
            </div>
          </div>
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-teal-700">Live workspace preview</p>
                <h2 className="mt-2 text-2xl font-black">Signal stack</h2>
              </div>
              <Badge tone="amber">Mock data</Badge>
            </div>
            <div className="mt-6 grid gap-3">
              {newsImpacts.map((impact) => (
                <div key={impact.headline} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{impact.asset}</strong>
                    <Badge tone={impact.sentiment === "Positive" ? "teal" : impact.sentiment === "Negative" ? "red" : "amber"}>
                      {impact.impactScore}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{impact.headline}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Disclaimer />

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {marketMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <SectionHeader
              eyebrow="Market dashboard"
              title="Impact and sentiment trend"
              description="A visual placeholder for market data integrations, designed for quick classroom or professional interpretation."
            />
            <LineChart points={trendSeries} />
          </Card>
          <Card>
            <SectionHeader eyebrow="Heatmap" title="Sector signal map" />
            <Heatmap sectors={sectorSignals} />
          </Card>
        </section>

        <section>
          <SectionHeader
            eyebrow="Target users"
            title="Three learning and workflow modes"
            description="The same market data can be framed differently depending on the user's level and goals."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {audiences.map((audience) => (
              <Card key={audience.label}>
                <h3 className="text-xl font-black">{audience.label}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{audience.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Reports library" title="Recent research outputs" />
          <div className="grid gap-4 md:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.title}>
                <Badge tone={report.status === "Ready" ? "teal" : report.status === "Draft" ? "amber" : "slate"}>
                  {report.status}
                </Badge>
                <h3 className="mt-4 text-lg font-black">{report.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{report.summary}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
