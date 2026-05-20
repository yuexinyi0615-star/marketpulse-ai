import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { reports } from "@/data/mockMarket";

export default function ReportsPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Reports library"
        title="Research report library placeholder"
        description="Reusable report cards for student templates, graduate research briefs, and professional decision notes."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title}>
            <div className="flex items-start justify-between gap-4">
              <Badge tone={report.status === "Ready" ? "teal" : report.status === "Draft" ? "amber" : "slate"}>{report.status}</Badge>
              <span className="text-xs font-extrabold text-muted">{report.audience}</span>
            </div>
            <h2 className="mt-4 text-xl font-black">{report.title}</h2>
            <p className="mt-1 text-sm font-bold text-teal-700">{report.category}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{report.summary}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
