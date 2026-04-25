import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

const PRIVATE_IP_REGEX =
  /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|::1|localhost)/i;

async function fetchGeoForIp(
  ip: string
): Promise<{ country?: string; countryCode?: string }> {
  if (!ip || PRIVATE_IP_REGEX.test(ip)) return {};
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=country,countryCode`,
      { signal: AbortSignal.timeout(3000) }
    );
    const data = (await res.json()) as { country?: string; countryCode?: string };
    return { country: data?.country, countryCode: data?.countryCode };
  } catch {
    return {};
  }
}

function getPathFromUrl(url: string | undefined): string {
  if (!url) return "/";
  try {
    const u = new URL(url, "https://_");
    return u.pathname || "/";
  } catch {
    return url;
  }
}

function getDeviceFromUserAgent(ua: string | undefined): string {
  if (!ua) return "Other";
  const lower = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(lower)) return "iOS";
  if (/android/.test(lower)) return "Android";
  if (/macintosh|mac os/.test(lower)) return "Mac";
  if (/windows/.test(lower)) return "Windows";
  if (/linux/.test(lower)) return "GNU/Linux";
  return "Other";
}

function getDeviceCategory(ua: string | undefined): "Desktop" | "Mobile" | "Tablet" {
  if (!ua) return "Desktop";
  const lower = ua.toLowerCase();
  if (/tablet|ipad/.test(lower)) return "Tablet";
  if (/mobile|iphone|ipod|android(?!.*mobile)/.test(lower)) return "Mobile";
  return "Desktop";
}

type PageViewRow = {
  _id: string;
  url?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  recordedAt: string;
};

const DATE_RANGE_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "180d": 180,
  "365d": 365,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") || "7d";
    const days = DATE_RANGE_DAYS[dateRange];
    const cutoff = new Date();
    if (typeof days === "number") {
      cutoff.setDate(cutoff.getDate() - days);
    }
    const dateFilter =
      typeof days === "number" ? ` && recordedAt >= "${cutoff.toISOString()}"` : "";

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    const fiveMinFilter = ` && recordedAt >= "${fiveMinutesAgo.toISOString()}"`;

    const [
      pageViews,
      pageViewsLast5Min,
      uniqueSessionsLast5Min,
      eventsLast5Min,
      overview,
      latestMetrics,
    ] = await Promise.all([
      client.fetch<PageViewRow[]>(
        `*[_type == "pageView"${dateFilter}] | order(recordedAt desc) [0...3000] {
          _id,
          url,
          sessionId,
          ipAddress,
          userAgent,
          recordedAt
        }`
      ),
      client.fetch<number>(
        `count(*[_type == "pageView"${fiveMinFilter}])`
      ),
      client.fetch<number>(
        `count(array::unique(*[_type == "pageView"${fiveMinFilter}].sessionId))`
      ),
      client.fetch<number>(
        `count(*[_type == "userEvent"${fiveMinFilter}])`
      ),
      (async () => {
        const [totalPageViews, totalEvents, errorCount] = await Promise.all([
          client.fetch<number>(`count(*[_type == "pageView"])`),
          client.fetch<number>(`count(*[_type == "userEvent"])`),
          client.fetch<number>(
            `count(*[_type == "errorLog" && (severity == "high" || severity == "critical")])`
          ),
        ]);
        const today = new Date().toISOString().split("T")[0];
        const todayStart = today + "T00:00:00.000Z";
        const [pageViewsToday, uniqueSessionsToday, uniqueSessionsYesterday] =
          await Promise.all([
            client.fetch<number>(
              `count(*[_type == "pageView" && recordedAt >= $today])`,
              { today: todayStart }
            ),
            client.fetch<number>(
              `count(array::unique(*[_type == "pageView" && recordedAt >= $today].sessionId))`,
              { today: todayStart }
            ),
            (async () => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split("T")[0];
              return client.fetch<number>(
                `count(array::unique(*[_type == "pageView" && recordedAt >= $yesterday && recordedAt < $today].sessionId))`,
                {
                  yesterday: yesterdayStr + "T00:00:00.000Z",
                  today: todayStart,
                }
              );
            })(),
          ]);
        const activeUsersToday = uniqueSessionsToday ?? 0;
        const activeUsersYesterday = uniqueSessionsYesterday ?? 0;
        let pageViewsThisPeriod = 0;
        let pageViewsPrevPeriod = 0;
        if (typeof days === "number") {
          const prevPeriodEnd = new Date(cutoff);
          const prevPeriodStart = new Date(cutoff);
          prevPeriodStart.setDate(prevPeriodStart.getDate() - days);
          [pageViewsThisPeriod, pageViewsPrevPeriod] = await Promise.all([
            client.fetch<number>(
              `count(*[_type == "pageView" && recordedAt >= $start])`,
              { start: cutoff.toISOString() }
            ),
            client.fetch<number>(
              `count(*[_type == "pageView" && recordedAt >= $start && recordedAt < $end])`,
              {
                start: prevPeriodStart.toISOString(),
                end: prevPeriodEnd.toISOString(),
              }
            ),
          ]);
        } else {
          pageViewsThisPeriod = await client.fetch<number>(
            `count(*[_type == "pageView"])`
          );
        }
        const pageViewsChange =
          pageViewsPrevPeriod > 0
            ? Math.round(
                ((pageViewsThisPeriod - pageViewsPrevPeriod) /
                  pageViewsPrevPeriod) *
                  100
              )
            : 0;
        const activeUsersChange =
          activeUsersYesterday > 0
            ? Math.round(
                ((activeUsersToday - activeUsersYesterday) /
                  activeUsersYesterday) *
                  100
              )
            : 0;
        return {
          totalPageViews,
          pageViewsToday: pageViewsThisPeriod,
          pageViewsChange,
          activeUsers: activeUsersToday,
          activeUsersChange,
          systemHealth: errorCount,
          totalEvents,
        };
      })(),
      client.fetch<
        Array<{
          metricType: string;
          value: number;
          unit?: string;
          status?: string;
          recordedAt: string;
        }>
      >(
        `*[_type == "systemMetric"] | order(recordedAt desc) [0...10] {
          metricType,
          value,
          unit,
          status,
          recordedAt
        }`
      ),
    ]);

    const uniqueIps = [
      ...new Set(pageViews.map((i) => i.ipAddress).filter(Boolean)),
    ] as string[];
    const ipToGeo = new Map<string, { country?: string; countryCode?: string }>();
    await Promise.all(
      uniqueIps.slice(0, 50).map(async (ip) => {
        const geo = await fetchGeoForIp(ip);
        if (geo.country || geo.countryCode) ipToGeo.set(ip, geo);
      })
    );

    const pathVisitorCounts = new Map<string, number>();
    const countryCounts = new Map<string, { country: string; count: number }>();
    const deviceCounts = new Map<string, number>();
    const deviceCategoryCounts = new Map<string, number>();

    for (const row of pageViews) {
      const path = getPathFromUrl(row.url);
      pathVisitorCounts.set(path, (pathVisitorCounts.get(path) ?? 0) + 1);

      const device = getDeviceFromUserAgent(row.userAgent);
      deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);

      const category = getDeviceCategory(row.userAgent);
      deviceCategoryCounts.set(
        category,
        (deviceCategoryCounts.get(category) ?? 0) + 1
      );

      const geo = row.ipAddress ? ipToGeo.get(row.ipAddress) : undefined;
      const country = geo?.country ?? "Unknown";
      const countryCode = geo?.countryCode ?? "??";
      const key = countryCode;
      if (!countryCounts.has(key)) {
        countryCounts.set(key, { country, count: 0 });
      }
      countryCounts.get(key)!.count++;
    }

    const totalVisitors = pageViews.length;
    const uniqueVisitorsInPeriod = new Set(
      pageViews.map((r) => r.sessionId).filter(Boolean)
    ).size;
    for (const row of pageViews) {
      const path = getPathFromUrl(row.url);
      pathVisitorCounts.set(
        path,
        (pathVisitorCounts.get(path) ?? 0) + 1
      );
    }

    const topPages = Array.from(pathVisitorCounts.entries())
      .map(([path, count]) => ({ path, visitors: count }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);

    const topCountries = Array.from(countryCounts.entries())
      .filter(([code]) => code !== "??")
      .map(([countryCode, v]) => ({
        country: v.country,
        countryCode,
        visitors: v.count,
        percentage:
          totalVisitors > 0
            ? Math.round((v.count / totalVisitors) * 100)
            : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);

    const deviceBreakdown = Array.from(deviceCounts.entries())
      .map(([device, count]) => ({
        device,
        visitors: count,
        percentage:
          totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors);

    const deviceCategoryBreakdown = Array.from(deviceCategoryCounts.entries())
      .map(([device, count]) => ({
        device,
        visitors: count,
        percentage:
          totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors);

    const memoryHeap = latestMetrics.find((m) => m.metricType === "memory_heap");
    const memoryRss = latestMetrics.find((m) => m.metricType === "memory_rss");
    const HEAP_LIMIT_MB = 1024;
    const memoryUsagePercent =
      memoryHeap?.value != null
        ? Math.min(100, Math.round((memoryHeap.value / HEAP_LIMIT_MB) * 100))
        : null;

    const systemHealth = {
      cpu: null as number | null,
      memory: memoryUsagePercent != null ? memoryUsagePercent : (memoryRss?.value != null ? Math.min(100, Math.round((memoryRss.value / HEAP_LIMIT_MB) * 100)) : null),
      disk: null as number | null,
      memoryHeapMB: memoryHeap?.value ?? null,
      memoryRssMB: memoryRss?.value ?? null,
      status:
        memoryUsagePercent != null
          ? memoryUsagePercent > 90
            ? "Critical"
            : memoryUsagePercent > 70
              ? "Warning"
              : "Good"
          : "Unknown",
    };

    const activeUsersLast5Min = uniqueSessionsLast5Min ?? 0;

    const dailyByDate = new Map<string, { sessions: Set<string>; pageViews: number }>();
    if (typeof days === "number") {
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        dailyByDate.set(dateStr, { sessions: new Set(), pageViews: 0 });
      }
      for (const row of pageViews) {
        const dateStr = row.recordedAt?.split("T")[0];
        if (dateStr && dailyByDate.has(dateStr)) {
          const entry = dailyByDate.get(dateStr)!;
          entry.pageViews++;
          if (row.sessionId) entry.sessions.add(row.sessionId);
        }
      }
    } else {
      for (const row of pageViews) {
        const dateStr = row.recordedAt?.split("T")[0];
        if (!dateStr) continue;
        const existing = dailyByDate.get(dateStr) ?? {
          sessions: new Set<string>(),
          pageViews: 0,
        };
        existing.pageViews++;
        if (row.sessionId) existing.sessions.add(row.sessionId);
        dailyByDate.set(dateStr, existing);
      }
    }
    const dailyTrend = Array.from(dailyByDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { sessions, pageViews }]) => ({
        date,
        visitors: sessions.size,
        pageViews,
      }));

    const activityLevel =
      activeUsersLast5Min > 20
        ? "High"
        : activeUsersLast5Min > 5
          ? "Medium"
          : "Low";

    return NextResponse.json({
      overview: {
        totalPageViews: overview.totalPageViews,
        pageViewsToday: overview.pageViewsToday,
        pageViewsChange: overview.pageViewsChange,
        activeUsers: overview.activeUsers,
        activeUsersChange: overview.activeUsersChange,
        systemHealth: overview.systemHealth,
        totalEvents: overview.totalEvents,
        uniqueVisitorsInPeriod,
      },
      topPages,
      topCountries,
      deviceBreakdown,
      deviceCategoryBreakdown,
      dailyTrend,
      realtimeActivity: {
        activeUsersLast5Min,
        pageViewsLast5Min: pageViewsLast5Min ?? 0,
        eventsLast5Min: eventsLast5Min ?? 0,
      },
      activityLevel,
      systemHealth,
    });
  } catch (error) {
    console.error("System monitoring API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch system monitoring data" },
      { status: 500 }
    );
  }
}
