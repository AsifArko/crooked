import { NextRequest, NextResponse } from "next/server";
import { runLocationCrawl } from "@/lib/jobs/crawler/orchestrator";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await runLocationCrawl();
    return NextResponse.json({
      ok: true,
      status: result.status,
      totalJobsFound: result.totalJobsFound,
      totalCreated: result.totalCreated,
      totalUpdated: result.totalUpdated,
      locationStats: result.locationStats,
      errorLog: result.errorLog,
    });
  } catch (error) {
    console.error("Cron crawl-jobs-locations error:", error);
    return NextResponse.json(
      { error: "Location crawl failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
