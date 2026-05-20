type Point = {
  label: string;
  impact: number;
  sentiment: number;
};

function buildPath(points: Point[], key: "impact" | "sentiment") {
  return points
    .map((point, index) => {
      const x = 44 + index * (312 / (points.length - 1));
      const y = 180 - point[key] * 1.45;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function LineChart({ points }: { points: Point[] }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <svg className="h-72 w-full" viewBox="0 0 400 220" role="img" aria-label="Impact and sentiment trend chart">
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="36" x2="370" y1={36 + line * 42} y2={36 + line * 42} stroke="#d8dee8" />
        ))}
        <path d={buildPath(points, "impact")} fill="none" stroke="#0f766e" strokeLinecap="round" strokeWidth="5" />
        <path d={buildPath(points, "sentiment")} fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="4" opacity="0.72" />
        {points.map((point, index) => {
          const x = 44 + index * (312 / (points.length - 1));
          const y = 180 - point.impact * 1.45;
          return <circle key={point.label} cx={x} cy={y} r="5" fill="#ffffff" stroke="#0f766e" strokeWidth="3" />;
        })}
        {points.map((point, index) => {
          const x = 35 + index * (312 / (points.length - 1));
          return (
            <text key={point.label} x={x} y="208" fill="#687386" fontSize="11" fontWeight="700">
              {point.label}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-4 text-xs font-bold text-muted">
        <span><span className="mr-2 inline-block h-2 w-5 rounded bg-teal-600" />Impact</span>
        <span><span className="mr-2 inline-block h-2 w-5 rounded bg-blue-600" />Sentiment</span>
      </div>
    </div>
  );
}
