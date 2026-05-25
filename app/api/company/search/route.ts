import { NextRequest, NextResponse } from "next/server";
import { defaultCompanyResults, searchCompanies } from "@/lib/companyProviders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const result = query.trim()
      ? await searchCompanies(query)
      : {
          source: "mock" as const,
          results: defaultCompanyResults()
        };

    return NextResponse.json({
      ok: true,
      ...result
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Company search failed.",
        source: "mock",
        results: defaultCompanyResults()
      },
      { status: 500 }
    );
  }
}
