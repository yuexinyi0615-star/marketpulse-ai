import { AppShell } from "@/components/AppShell";
import { CompanySearchClient } from "@/components/CompanySearchClient";
import { SectionHeader } from "@/components/SectionHeader";

export default function CompanySearchPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Company search"
        title="Live company quote search"
        description="Search live public quote data in the browser, then jump to external company research sources."
      />
      <CompanySearchClient />
    </AppShell>
  );
}
