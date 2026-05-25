import { NextRequest, NextResponse } from "next/server";
import { getCompanyDetail } from "@/lib/companyProviders";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await context.params;

  try {
    const company = await getCompanyDetail(symbol);
    return NextResponse.json({
      ok: true,
      company
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Company detail failed."
      },
      { status: 500 }
    );
  }
}
