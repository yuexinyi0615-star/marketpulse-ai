import { AppShell } from "@/components/AppShell";
import { LiveMarketDashboard } from "@/components/LiveMarketDashboard";

export default function NewsImpactPage() {
  return (
    <AppShell>
      <LiveMarketDashboard mode="news" />
    </AppShell>
  );
}
