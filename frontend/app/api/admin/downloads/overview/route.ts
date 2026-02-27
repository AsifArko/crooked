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

function getDeviceCategory(
  ua: string | undefined
): "Desktop" | "Mobile" | "Tablet" {
  if (!ua) return "Desktop";
  const lower = ua.toLowerCase();
  if (/tablet|ipad/.test(lower)) return "Tablet";
  if (/mobile|iphone|ipod|android(?!.*mobile)/.test(lower)) return "Mobile";
  return "Desktop";
}

type DownloadRow = {
  _id: string;
  ipAddress?: string;
  userAgent?: string;
  recordedAt: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") || "7d";
    const days = dateRange === "30d" ? 30 : 7;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const dateFilter = ` && recordedAt >= "${cutoff.toISOString()}"`;

    const downloads = await client.fetch<DownloadRow[]>(
      `*[_type == "resumeDownload"${dateFilter}] | order(recordedAt desc) [0...2000] {
        _id,
        ipAddress,
        userAgent,
        recordedAt
      }`
    );

    const totalDownloads = downloads.length;

    const uniqueIps = [
      ...new Set(downloads.map((i) => i.ipAddress).filter(Boolean)),
    ] as string[];
    const ipToGeo = new Map<string, { country?: string; countryCode?: string }>();
    await Promise.all(
      uniqueIps.slice(0, 50).map(async (ip) => {
        const geo = await fetchGeoForIp(ip);
        if (geo.country || geo.countryCode) ipToGeo.set(ip, geo);
      })
    );

    const countryCounts = new Map<string, { country: string; count: number }>();
    const deviceCounts = new Map<string, number>();
    const deviceCategoryCounts = new Map<string, number>();

    for (const row of downloads) {
      const geo = row.ipAddress ? ipToGeo.get(row.ipAddress) : undefined;
      const country = geo?.country ?? "Unknown";
      const countryCode = geo?.countryCode ?? "??";
      const key = countryCode;
      if (!countryCounts.has(key)) {
        countryCounts.set(key, { country, count: 0 });
      }
      countryCounts.get(key)!.count++;

      const device = getDeviceFromUserAgent(row.userAgent);
      deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);

      const category = getDeviceCategory(row.userAgent);
      deviceCategoryCounts.set(
        category,
        (deviceCategoryCounts.get(category) ?? 0) + 1
      );
    }

    const topCountries = Array.from(countryCounts.entries())
      .filter(([code]) => code !== "??")
      .map(([countryCode, v]) => ({
        country: v.country,
        countryCode,
        visitors: v.count,
        percentage:
          totalDownloads > 0
            ? Math.round((v.count / totalDownloads) * 100)
            : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);

    const deviceBreakdown = Array.from(deviceCounts.entries())
      .map(([device, count]) => ({
        device,
        visitors: count,
        percentage:
          totalDownloads > 0
            ? Math.round((count / totalDownloads) * 100)
            : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors);

    const deviceCategoryBreakdown = Array.from(deviceCategoryCounts.entries())
      .map(([device, count]) => ({
        device,
        visitors: count,
        percentage:
          totalDownloads > 0
            ? Math.round((count / totalDownloads) * 100)
            : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors);

    const dailyByDate = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyByDate.set(dateStr, 0);
    }
    for (const row of downloads) {
      const dateStr = row.recordedAt?.split("T")[0];
      if (dateStr && dailyByDate.has(dateStr)) {
        dailyByDate.set(dateStr, (dailyByDate.get(dateStr) ?? 0) + 1);
      }
    }
    const dailyTrend = Array.from(dailyByDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, downloads]) => ({
        date,
        downloads,
        visitors: downloads,
        pageViews: downloads,
      }));

    const [totalAllTime] = await Promise.all([
      client.fetch<number>(`count(*[_type == "resumeDownload"])`),
    ]);

    return NextResponse.json({
      overview: {
        totalDownloads: totalAllTime,
        downloadsInPeriod: totalDownloads,
      },
      dailyTrend,
      topCountries,
      deviceBreakdown,
      deviceCategoryBreakdown,
    });
  } catch (error) {
    console.error("Downloads overview API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch downloads overview" },
      { status: 500 }
    );
  }
}
