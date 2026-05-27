import { MOCK_REPORTS, getMockReport, type ResearchReport } from "@/lib/reportsData";
import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabaseServer";

export async function listReports(): Promise<{ source: "supabase" | "mock"; reports: ResearchReport[] }> {
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    return {
      source: "mock",
      reports: MOCK_REPORTS
    };
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("period_end", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return {
      source: "mock",
      reports: MOCK_REPORTS
    };
  }

  return {
    source: "supabase",
    reports: data as ResearchReport[]
  };
}

export async function getReport(slug: string): Promise<{ source: "supabase" | "mock"; report: ResearchReport }> {
  const supabase = createSupabaseServerClient();

  if (!supabase || !hasSupabaseServerConfig) {
    return {
      source: "mock",
      report: getMockReport(slug)
    };
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return {
      source: "mock",
      report: getMockReport(slug)
    };
  }

  return {
    source: "supabase",
    report: data as ResearchReport
  };
}

export async function scheduledReportGenerationPlaceholder(reportType?: string) {
  return {
    ok: true,
    status: "scheduled-placeholder",
    report_type: reportType ?? "all",
    message: "Report generation placeholder is ready for future cron-based AI generation from market data, news analysis, and Supabase history."
  };
}
