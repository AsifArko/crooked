import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

const PRIVATE_IP_REGEX = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|::1|localhost)/i;

async function fetchGeoForIp(ip: string): Promise<{ country?: string; countryCode?: string }> {
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

function getDeviceLabel(ua: string | undefined): string {
  if (!ua) return "other";
  const lower = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(lower)) return "ios";
  if (/android/.test(lower)) return "android";
  if (/macintosh|mac os/.test(lower)) return "mac";
  if (/windows/.test(lower)) return "windows";
  if (/linux/.test(lower)) return "linux";
  return "other";
}

function getBrowserLabel(ua: string | undefined): string {
  if (!ua) return "other";
  const lower = ua.toLowerCase();
  if (/edg\//.test(lower)) return "edge";
  if (/opr\//.test(lower) || /opera/.test(lower)) return "opera";
  if (/firefox/.test(lower)) return "firefox";
  if (/chrome/.test(lower) && !/edg|opr|opera/.test(lower)) return "chrome";
  if (/safari/.test(lower) && !/chrome/.test(lower)) return "safari";
  return "other";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const search = searchParams.get("search")?.trim() ?? "";
    const dateFrom = searchParams.get("dateFrom") ?? "";
    const dateTo = searchParams.get("dateTo") ?? "";
    const device = searchParams.get("device") ?? "";
    const countryCode = searchParams.get("countryCode") ?? "";
    const browser = searchParams.get("browser") ?? "";

    const hasFilters = Boolean(search || dateFrom || dateTo || device || countryCode || browser);

    // Build GROQ filter
    const filters: string[] = ['_type == "resumeDownload"'];
    if (dateFrom) {
      filters.push(`recordedAt >= "${dateFrom}T00:00:00.000Z"`);
    }
    if (dateTo) {
      filters.push(`recordedAt <= "${dateTo}T23:59:59.999Z"`);
    }
    // Search is applied in post-processing (GROQ match can be unreliable for plain strings)
    const filterStr = filters.join(" && ");
    const baseQuery = `*[${filterStr}] | order(recordedAt desc)`;

    // When filters are applied, fetch more for post-processing (search/device/country); otherwise paginate in GROQ
    const from = (page - 1) * limit;
    const to = from + limit;
    const groqSlice = hasFilters ? `[0...2000]` : `[$from...$to]`;

    const items = await client.fetch<
      Array<{
        _id: string;
        ipAddress?: string;
        hostname?: string;
        userAgent?: string;
        sessionId?: string;
        referrer?: string;
        recordedAt: string;
      }>
    >(
      `${baseQuery} ${groqSlice} {
        _id,
        ipAddress,
        hostname,
        userAgent,
        sessionId,
        referrer,
        recordedAt
      }`,
      hasFilters ? {} : { from, to }
    );

    const uniqueIps = [...new Set(items.map((i) => i.ipAddress).filter(Boolean))] as string[];
    const ipToGeo = new Map<string, { country?: string; countryCode?: string }>();
    await Promise.all(
      uniqueIps.slice(0, 50).map(async (ip) => {
        const geo = await fetchGeoForIp(ip);
        if (geo.country || geo.countryCode) ipToGeo.set(ip, geo);
      })
    );

    let itemsWithGeo = items.map((row) => {
      const geo = row.ipAddress ? ipToGeo.get(row.ipAddress) : undefined;
      return {
        ...row,
        country: geo?.country,
        countryCode: geo?.countryCode,
      };
    });

    // Post-filter by search, device, and country (not in Sanity / need JS logic)
    if (search) {
      const q = search.toLowerCase();
      itemsWithGeo = itemsWithGeo.filter(
        (row) =>
          (row.ipAddress?.toLowerCase().includes(q)) ||
          (row.sessionId?.toLowerCase().includes(q)) ||
          (row.hostname?.toLowerCase().includes(q))
      );
    }
    if (device) {
      itemsWithGeo = itemsWithGeo.filter((row) => getDeviceLabel(row.userAgent) === device);
    }
    if (countryCode) {
      itemsWithGeo = itemsWithGeo.filter((row) => {
        const code = row.countryCode?.toUpperCase() ?? "";
        if (countryCode === "unknown") return !code || code === "??";
        return code === countryCode.toUpperCase();
      });
    }
    if (browser) {
      itemsWithGeo = itemsWithGeo.filter((row) => getBrowserLabel(row.userAgent) === browser);
    }

    const total = itemsWithGeo.length;
    const paginated = hasFilters
      ? itemsWithGeo.slice((page - 1) * limit, page * limit)
      : itemsWithGeo;

    const [totalAllTime, totalForPagination] = await Promise.all([
      client.fetch<number>(`count(*[_type == "resumeDownload"])`),
      hasFilters ? Promise.resolve(total) : client.fetch<number>(`count(*[${filterStr}])`),
    ]);

    return NextResponse.json({
      items: paginated,
      total: hasFilters ? total : totalForPagination,
      page,
      limit,
      summary: {
        totalDownloads: totalAllTime,
      },
    });
  } catch (error) {
    console.error("Downloads API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch downloads" },
      { status: 500 }
    );
  }
}
