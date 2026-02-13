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
    const eventType = searchParams.get("eventType")?.trim() || "";
    const sessionIdParam = searchParams.get("sessionId")?.trim() || "";
    const excludeSessionIdParam = searchParams.get("excludeSessionId")?.trim() || "";
    const from = (page - 1) * limit;
    const to = from + limit;

    const dateFilter = getDateFilter(dateRange);
    const eventTypeFilter =
      eventType && eventType !== "all"
        ? ` && eventType == "${eventType}"`
        : "";
    const searchFilter =
      search === ""
        ? ""
        : ` && (eventType match "*${escapeMatch(search)}*" || eventName match "*${escapeMatch(search)}*" || (defined(url) && url match "*${escapeMatch(search)}*") || (defined(sessionId) && sessionId match "*${escapeMatch(search)}*"))`;
    const sessionFilter =
      sessionIdParam !== ""
        ? (() => {
            const ids = sessionIdParam.split(",").map((s) => s.trim()).filter(Boolean);
            if (ids.length === 0) return "";
            return ` && sessionId in ${JSON.stringify(ids)}`;
          })()
        : excludeSessionIdParam !== ""
          ? (() => {
              const ids = excludeSessionIdParam.split(",").map((s) => s.trim()).filter(Boolean);
              if (ids.length === 0) return "";
              return ` && !(sessionId in ${JSON.stringify(ids)})`;
            })()
          : "";
    const baseFilter = `*[_type == "userEvent"${dateFilter}${eventTypeFilter}${searchFilter}${sessionFilter}]`;

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          eventType: string;
          eventName: string;
          url?: string;
          sessionId: string;
          ipAddress?: string;
          hostname?: string;
          metadata?: object;
          recordedAt: string;
        }>
      >(
        `${baseFilter} | order(recordedAt desc) [$from...$to] {
          _id,
          eventType,
          eventName,
          url,
          sessionId,
          ipAddress,
          hostname,
          metadata,
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
    console.error("Events API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
