import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [pageViewsCount, userEventsCount, errorLogsCount] = await Promise.all([
      client.fetch<number>(`count(*[_type == "pageView"])`),
      client.fetch<number>(`count(*[_type == "userEvent"])`),
      client.fetch<number>(
        `count(*[_type == "errorLog" && (severity == "high" || severity == "critical")])`
      ),
    ]);

    const today = new Date().toISOString().split("T")[0];
    const pageViewsToday = await client.fetch<number>(
      `count(*[_type == "pageView" && recordedAt >= $today])`,
      { today }
    );

    return NextResponse.json({
      totalPageViews: pageViewsCount,
      pageViewsChange: 0,
      activeUsers: pageViewsToday,
      activeUsersNote: "Unique sessions today",
      systemHealth: errorLogsCount,
      systemHealthNote: "Critical/High errors",
      conversions: 0,
      conversionsNote: "Total conversions",
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
