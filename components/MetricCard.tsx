import type { MarketMetric } from "@/types/market";

const toneClass = {
  positive: "text-emerald-700",
  neutral: "text-ink",
  negative: "text-danger"
};

export function MetricCard({ metric }: { metric: MarketMetric }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <p className="text-sm font-bold text-muted">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-extrabold text-ink">{metric.value}</strong>
        <span className={`text-sm font-extrabold ${toneClass[metric.tone]}`}>{metric.change}</span>
      </div>
    </article>
  );
}
