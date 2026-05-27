import { NextResponse } from "next/server";
import { listReports } from "@/lib/reportsProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await listReports();
  return NextResponse.json({
    ok: true,
    ...result
  });
}
