import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

function getDateFilter(dateRange: string | null): string {
  if (!dateRange || dateRange === "all") return "";
  const days = dateRange === "30d" ? 30 : 7;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return ` && recordedAt >= "${cutoff.toISOString()}"`;
}

function escapeMatch(s: string) {
  return s.replace(/["\\*]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const dateRange = searchParams.get("dateRange") || "7d";
    const severity = searchParams.get("severity")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const from = (page - 1) * limit;
    const to = from + limit;

    const dateFilter = getDateFilter(dateRange);
    const severityFilter =
      severity && severity !== "all" ? ` && severity == "${severity}"` : "";
    const statusFilter =
      status && status !== "all" ? ` && status == "${status}"` : "";
    const searchFilter =
      search === ""
        ? ""
        : ` && (errorType match "*${escapeMatch(search)}*" || message match "*${escapeMatch(search)}*" || (defined(url) && url match "*${escapeMatch(search)}*"))`;
    const baseFilter = `*[_type == "errorLog"${dateFilter}${severityFilter}${statusFilter}${searchFilter}]`;

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          errorType: string;
          message: string;
          severity?: string;
          url?: string;
          ipAddress?: string;
          hostname?: string;
          stackTrace?: string;
          status?: string;
          recordedAt: string;
        }>
      >(
        `${baseFilter} | order(recordedAt desc) [$from...$to] {
          _id,
          errorType,
          message,
          severity,
          url,
          ipAddress,
          hostname,
          stackTrace,
          status,
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
    console.error("Error logs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch error logs" },
      { status: 500 }
    );
  }
}
