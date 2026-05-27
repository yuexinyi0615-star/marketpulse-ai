import { NextRequest, NextResponse } from "next/server";
import { getReport } from "@/lib/reportsProvider";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const result = await getReport(slug);
  return NextResponse.json({
    ok: true,
    ...result
  });
}
