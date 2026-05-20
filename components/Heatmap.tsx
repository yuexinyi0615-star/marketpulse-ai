import { Badge } from "@/components/Badge";
import type { SectorSignal } from "@/types/market";

function tone(score: number) {
  if (score >= 75) return "from-teal-600 to-emerald-500 text-white";
  if (score >= 55) return "from-amber-500 to-yellow-400 text-slate-950";
  return "from-slate-300 to-slate-200 text-slate-800";
}

export function Heatmap({ sectors }: { sectors: SectorSignal[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {sectors.map((sector) => (
        <article
          key={sector.name}
          className={`min-h-32 rounded-lg bg-gradient-to-br p-4 ${tone(sector.score)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="max-w-32 text-base font-extrabold">{sector.name}</h3>
            <Badge tone={sector.momentum === "Hot" ? "teal" : sector.momentum === "Watch" ? "amber" : "slate"}>
              {sector.momentum}
            </Badge>
          </div>
          <p className="mt-8 text-4xl font-black">{sector.score}</p>
          <p className="mt-1 text-xs font-bold opacity-80">Composite signal</p>
        </article>
      ))}
    </div>
  );
}
