import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

function getDateFilter(dateRange: string | null): string {
  if (!dateRange || dateRange === "all") return "";
  const days = dateRange === "30d" ? 30 : 7;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return ` && recordedAt >= "${cutoff.toISOString()}"`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const dateRange = searchParams.get("dateRange") || "7d";
    const from = (page - 1) * limit;
    const to = from + limit;

    const dateFilter = getDateFilter(dateRange);
    const escapeMatch = (s: string) => s.replace(/["\\*]/g, "\\$&");
    const searchFilter =
      search === ""
        ? ""
        : ` && (url match "*${escapeMatch(search)}*" || sessionId match "*${escapeMatch(search)}*")`;
    const baseFilter = `*[_type == "pageView"${dateFilter}${searchFilter}]`;

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          url: string;
          sessionId: string;
          ipAddress?: string;
          hostname?: string;
          userAgent?: string;
          loadTimeMs?: number;
          referrer?: string;
          recordedAt: string;
        }>
      >(
        `${baseFilter} | order(recordedAt desc) [$from...$to] {
          _id,
          url,
          sessionId,
          ipAddress,
          hostname,
          userAgent,
          loadTimeMs,
          referrer,
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
    console.error("Page views API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch page views" },
      { status: 500 }
    );
  }
}
