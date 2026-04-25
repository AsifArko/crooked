import { runCompanyCrawl } from "@/lib/companies/crawler";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/admin/companies/crawl
 * Trigger company crawl. Extracts companies from job APIs (same sources as jobs crawler).
 * Pass countryCode, industry, search, cityId to crawl with filters.
 */
export async function POST(request: NextRequest) {
  try {
    const params: { countryCode?: string; industry?: string; search?: string; cityId?: string } = {};
    try {
      const body = await request.json().catch(() => ({}));
      if (body && typeof body === "object") {
        if (body.countryCode?.trim()) params.countryCode = body.countryCode.trim();
        if (body.industry?.trim()) params.industry = body.industry.trim();
        if (body.search?.trim()) params.search = body.search.trim();
        if (body.cityId?.trim()) params.cityId = body.cityId.trim();
      }
    } catch {
      /* no body or invalid JSON */
    }

    const result = await runCompanyCrawl({
      params: Object.keys(params).length > 0 ? params : undefined,
      trigger: "manual",
    });

    return NextResponse.json({
      ok: true,
      crawlRunId: result.crawlRunId,
      status: result.status,
      totalFetched: result.totalFetched,
      totalCreated: result.totalCreated,
      totalUpdated: result.totalUpdated,
      totalErrors: result.totalErrors,
      durationMs: result.durationMs,
      params: Object.keys(params).length > 0 ? params : undefined,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Company crawl error:", err.message, err.stack);
    return NextResponse.json(
      {
        error: "Crawl failed",
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
