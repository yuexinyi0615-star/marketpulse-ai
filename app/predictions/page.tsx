import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { predictions } from "@/data/mockMarket";

function statusTone(status: string): "teal" | "amber" | "slate" {
  if (status === "Tracking") return "teal";
  if (status === "Needs review") return "amber";
  return "slate";
}

export default function PredictionsPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Prediction tracker"
        title="Research hypotheses and outcomes"
        description="A placeholder tracker for turning market research into measurable predictions and post-event review."
      />
      <div className="grid gap-4">
        {predictions.map((prediction) => (
          <Card key={prediction.thesis}>
            <div className="grid gap-4 md:grid-cols-[1fr_140px_140px] md:items-center">
              <div>
                <h2 className="text-lg font-black">{prediction.thesis}</h2>
                <p className="mt-2 text-sm font-bold text-muted">Horizon: {prediction.horizon}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Confidence</p>
                <p className="mt-1 text-2xl font-black">{prediction.confidence}%</p>
              </div>
              <Badge tone={statusTone(prediction.status)}>{prediction.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
