import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Heatmap } from "@/components/Heatmap";
import { LineChart } from "@/components/LineChart";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { marketMetrics, sectorSignals, trendSeries } from "@/data/mockMarket";

export default function MarketDashboardPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Market dashboard"
        title="Market pressure, momentum, and sector heat"
        description="Visual-first dashboard placeholders for live market feeds, macro signals, and sector rotations."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">Market trend</h2>
            <Badge tone="teal">Charts placeholder</Badge>
          </div>
          <LineChart points={trendSeries} />
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">Sector heatmap</h2>
            <Badge tone="amber">Demo scores</Badge>
          </div>
          <Heatmap sectors={sectorSignals} />
        </Card>
      </div>
    </AppShell>
  );
}
