import { NextRequest, NextResponse } from "next/server";
import { runCrawl } from "@/lib/jobs/crawler";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

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
    const result = await runCrawl({ trigger: "cron" });
    return NextResponse.json({
      ok: true,
      status: result.status,
      sourceStats: result.sourceStats,
    });
  } catch (error) {
    console.error("Cron crawl-jobs error:", error);
    return NextResponse.json(
      { error: "Crawl failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
