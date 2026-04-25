import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/geography/seed-runs
 * Returns history of geography seed runs.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const status = searchParams.get("status")?.trim();

    let filter = '_type == "geographySeedRun"';
    const params: Record<string, string | number> = { limit };
    if (status) {
      filter += " && status == $status";
      params.status = status;
    }

    const items = await client.fetch<
      Array<{
        _id: string;
        startedAt?: string;
        finishedAt?: string;
        status?: string;
        mode?: string;
        citiesCreated?: number;
        citiesUpdated?: number;
        citiesErrors?: number;
        countriesCreated?: number;
        countriesUpdated?: number;
        remainingCountries?: string[];
        processedCountries?: Array<{ countryCode: string; created: number; updated: number; errors: number }>;
        log?: string[];
      }>
    >(
      `*[${filter}] | order(startedAt desc)[0...$limit] {
        _id,
        startedAt,
        finishedAt,
        status,
        mode,
        citiesCreated,
        citiesUpdated,
        citiesErrors,
        countriesCreated,
        countriesUpdated,
        remainingCountries,
        processedCountries,
        log
      }`,
      params
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Seed runs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seed runs" },
      { status: 500 }
    );
  }
}
