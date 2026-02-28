import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SourceStat = {
  source: string;
  fetched: number;
  created: number;
  updated: number;
  errors: number;
};

type LocationStat = {
  city: string;
  country: string;
  queries: number;
  jobsFound: number;
  created: number;
  updated: number;
};

type CrawlRunDoc = {
  _id: string;
  startedAt: string;
  finishedAt: string;
  status: string;
  crawlType?: string;
  trigger?: string;
  params?: { search?: string; countryCode?: string; location?: string; source?: string };
  totalJobs?: number;
  totalCreated?: number;
  totalUpdated?: number;
  durationMs?: number;
  sourceStats?: SourceStat[];
  locationStats?: LocationStat[];
  errorLog?: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") ?? "20", 10)));
    const from = (page - 1) * limit;
    const to = from + limit;

    const [items, total] = await Promise.all([
      client.fetch<CrawlRunDoc[]>(
        `*[_type == "crawlRun"] | order(finishedAt desc)[$from...$to] {
          _id,
          startedAt,
          finishedAt,
          status,
          crawlType,
          trigger,
          params,
          totalJobs,
          totalCreated,
          totalUpdated,
          durationMs,
          sourceStats,
          locationStats,
          errorLog
        }`,
        { from, to }
      ),
      client.fetch<number>(`count(*[_type == "crawlRun"])`),
    ]);

    const runs = items.map((r) => {
      const totalFetched =
        r.totalJobs ??
        r.sourceStats?.reduce((s, x) => s + (x.fetched ?? 0), 0) ??
        0;
      const totalCreated =
        r.totalCreated ??
        r.sourceStats?.reduce((s, x) => s + (x.created ?? 0), 0) ??
        0;
      const totalUpdated =
        r.totalUpdated ??
        r.sourceStats?.reduce((s, x) => s + (x.updated ?? 0), 0) ??
        0;
      const totalErrors = r.sourceStats?.reduce((s, x) => s + (x.errors ?? 0), 0) ?? 0;
      const sourcesCount = r.sourceStats?.length ?? 0;

      return {
        _id: r._id,
        startedAt: r.startedAt,
        finishedAt: r.finishedAt,
        status: r.status,
        crawlType: r.crawlType ?? "jobs",
        trigger: r.trigger ?? "manual",
        params: r.params,
        totalFetched,
        totalCreated,
        totalUpdated,
        totalErrors,
        sourcesCount,
        durationMs: r.durationMs,
        sourceStats: r.sourceStats ?? [],
        locationStats: r.locationStats ?? [],
        errorLog: r.errorLog,
      };
    });

    return NextResponse.json({
      items: runs,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Crawls API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch crawl runs" },
      { status: 500 }
    );
  }
}
