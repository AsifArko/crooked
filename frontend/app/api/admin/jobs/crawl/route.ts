import { NextRequest, NextResponse } from "next/server";
import { runCrawl } from "@/lib/jobs/crawler";
import type { CrawlParams } from "@/lib/jobs/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    let params: CrawlParams | undefined;
    try {
      const body = await request.json();
      if (body && typeof body === "object") {
        params = {
          search: body.search,
          countryCode: body.countryCode,
          location: body.location,
          source: body.source,
        };
      }
    } catch {
      /* no body or invalid JSON */
    }
    const result = await runCrawl({
      params: params ?? undefined,
      trigger: "manual",
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Jobs crawl error:", error);
    return NextResponse.json(
      { error: "Crawl failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
