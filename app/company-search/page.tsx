import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { companies } from "@/data/mockMarket";

const riskTone = {
  Low: "teal",
  Medium: "amber",
  High: "red"
} as const;

export default function CompanySearchPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Company search"
        title="Company research placeholder"
        description="Search UI and company cards are ready for future market data, filings, and Supabase-backed saved research."
      />
      <Card className="mb-5">
        <label className="grid gap-2 text-sm font-bold text-muted">
          Search companies
          <input
            className="rounded-lg border border-slate-200 px-3 py-3 text-ink outline-none focus:border-teal-600"
            placeholder="Try NVDA, Microsoft, software, margin risk"
          />
        </label>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.ticker}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-muted">{company.ticker}</p>
                <h2 className="text-xl font-black">{company.name}</h2>
              </div>
              <Badge tone={riskTone[company.riskLevel]}>{company.riskLevel} risk</Badge>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-bold text-muted">Sector</dt>
                <dd className="mt-1 font-extrabold">{company.sector}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-bold text-muted">Market cap</dt>
                <dd className="mt-1 font-extrabold">{company.marketCap}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-muted">{company.thesis}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
