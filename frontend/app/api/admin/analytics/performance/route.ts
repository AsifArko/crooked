import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

function getDateFilter(dateRange: string | null): string {
  if (!dateRange || dateRange === "all") return "";
  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "180d": 180,
    "365d": 365,
  };
  const days = daysMap[dateRange] ?? 7;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return ` && recordedAt >= "${cutoff.toISOString()}"`;
}

function escapeMatch(s: string) {
  return s.replace(/[\\*]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const dateRange = searchParams.get("dateRange") || "7d";
    const metric = searchParams.get("metric")?.trim() || "";
    const from = (page - 1) * limit;
    const to = from + limit;

    const dateFilter = getDateFilter(dateRange);
    const metricFilter =
      metric && metric !== "all" ? ` && metric == "${metric}"` : "";
    const searchFilter =
      search === ""
        ? ""
        : ` && (metric match "*${escapeMatch(search)}*" || defined(url) && url match "*${escapeMatch(search)}*")`;
    const baseFilter = `*[_type == "performanceMetric"${dateFilter}${metricFilter}${searchFilter}]`;

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          metric: string;
          value: number;
          url?: string;
          sessionId?: string;
          ipAddress?: string;
          hostname?: string;
          recordedAt: string;
        }>
      >(
        `${baseFilter} | order(recordedAt desc) [$from...$to] {
          _id,
          metric,
          value,
          url,
          sessionId,
          ipAddress,
          hostname,
          recordedAt
        }`,
        { from, to }
      ),
      client.fetch<number>(`count(${baseFilter})`),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Performance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance metrics" },
      { status: 500 }
    );
  }
}
