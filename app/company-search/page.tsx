import { AppShell } from "@/components/AppShell";
import { CompanySearchClient } from "@/components/CompanySearchClient";
import { SectionHeader } from "@/components/SectionHeader";

export default function CompanySearchPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Company search"
        title="Company and ETF research search"
        description="Search by ticker, company name, sector, industry, ETF, or keyword. FMP data is used server-side when configured, with mock fallback data for development."
      />
      <CompanySearchClient />
    </AppShell>
  );
}
