import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { newsImpacts } from "@/data/mockMarket";

export default function NewsImpactPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="News impact"
        title="Headline-to-market impact engine"
        description="Mock scoring converts headlines into impact, sentiment, confidence, and explainable drivers."
      />
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-xl font-black">Analyze a headline</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-muted">
              Headline
              <textarea
                className="min-h-36 rounded-lg border border-slate-200 p-3 text-ink outline-none focus:border-teal-600"
                defaultValue="Chip suppliers rally as data center spending outlook improves."
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-muted">
              Asset or ticker
              <input className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600" defaultValue="NVDA" />
            </label>
            <button className="rounded-lg bg-teal-600 px-4 py-3 text-sm font-extrabold text-white">Run mock impact model</button>
          </div>
        </Card>
        <div className="grid gap-4">
          {newsImpacts.map((impact) => (
            <Card key={impact.headline}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge tone={impact.sentiment === "Positive" ? "teal" : impact.sentiment === "Negative" ? "red" : "amber"}>
                    {impact.sentiment}
                  </Badge>
                  <h2 className="mt-3 text-xl font-black">{impact.asset} impact score: {impact.impactScore}</h2>
                </div>
                <p className="text-sm font-extrabold text-muted">{impact.confidence}% confidence</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{impact.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {impact.drivers.map((driver) => (
                  <Badge key={driver}>{driver}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
