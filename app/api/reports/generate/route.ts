import { NextRequest, NextResponse } from "next/server";
import { scheduledReportGenerationPlaceholder } from "@/lib/reportsProvider";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({})) as { report_type?: string };
  return NextResponse.json(await scheduledReportGenerationPlaceholder(body.report_type));
}
