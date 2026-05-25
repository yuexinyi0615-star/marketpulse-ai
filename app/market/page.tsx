import { AppShell } from "@/components/AppShell";
import { LiveMarketDashboard } from "@/components/LiveMarketDashboard";

export default function MarketDashboardPage() {
  return (
    <AppShell>
      <LiveMarketDashboard mode="market" />
    </AppShell>
  );
}
