import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "15", 10)));
    const status = searchParams.get("status")?.trim() ?? "";
    const from = (page - 1) * limit;
    const to = from + limit;

    let filterStr = '_type == "companyCrawlRun"';
    const params: Record<string, string | number> = { from, to };
    if (status) {
      filterStr += " && status == $status";
      params.status = status;
    }

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          startedAt?: string;
          finishedAt?: string;
          status?: string;
          trigger?: string;
          params?: { cityId?: string; countryCode?: string; crawlSource?: string };
          totalFetched?: number;
          totalCreated?: number;
          totalUpdated?: number;
          totalErrors?: number;
          durationMs?: number;
          errorLog?: string;
        }>
      >(
        `*[${filterStr}] | order(startedAt desc)[$from...$to] {
          _id,
          startedAt,
          finishedAt,
          status,
          trigger,
          params,
          totalFetched,
          totalCreated,
          totalUpdated,
          totalErrors,
          durationMs,
          errorLog
        }`,
        params
      ),
      client.fetch<number>(`count(*[${filterStr}])`, params),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("Company crawls API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company crawls" },
      { status: 500 }
    );
  }
}
