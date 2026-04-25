import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

function getDateFilter(dateRange: string | null): string {
  if (!dateRange || dateRange === "all") return "";
  const days = dateRange === "30d" ? 30 : 7;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return ` && recordedAt >= "${cutoff.toISOString()}"`;
}

type PageViewItem = {
  _id: string;
  url: string;
  sessionId: string;
  ipAddress?: string;
  hostname?: string;
  userAgent?: string;
  loadTimeMs?: number;
  referrer?: string;
  recordedAt: string;
  country?: string;
  countryCode?: string;
  webVitals?: { lcp?: number; fcp?: number; cls?: number; ttfb?: number };
};

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const dateRange = searchParams.get("dateRange") || "7d";
    const sessionIdParam = searchParams.get("sessionId")?.trim() || "";
    const excludeSessionIdParam = searchParams.get("excludeSessionId")?.trim() || "";
    const from = (page - 1) * limit;
    const to = from + limit;

    const dateFilter = getDateFilter(dateRange);
    const escapeMatch = (s: string) => s.replace(/["\\*]/g, "\\$&");
    const searchFilter =
      search === ""
        ? ""
        : ` && (url match "*${escapeMatch(search)}*" || sessionId match "*${escapeMatch(search)}*")`;

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

    const baseFilter = `*[_type == "pageView"${dateFilter}${searchFilter}${sessionFilter}]`;

    const [items, total] = await Promise.all([
      client.fetch<PageViewItem[]>(
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

    const uniqueIps = [...new Set(items.map((i) => i.ipAddress).filter(Boolean))] as string[];
    const ipToGeo = new Map<string, { country?: string; countryCode?: string }>();
    await Promise.all(
      uniqueIps.slice(0, 30).map(async (ip) => {
        const geo = await fetchGeoForIp(ip);
        if (geo.country || geo.countryCode) ipToGeo.set(ip, geo);
      })
    );

    let itemsWithVitals = items.map((row) => {
      const geo = row.ipAddress ? ipToGeo.get(row.ipAddress) : undefined;
      return {
        ...row,
        country: geo?.country,
        countryCode: geo?.countryCode,
      };
    });

    const sessionIds = [...new Set(itemsWithVitals.map((i) => i.sessionId).filter(Boolean))] as string[];

    if (sessionIds.length > 0) {
      const vitalsBySession = await client.fetch<
        Array<{ sessionId: string; metric: string; value: number; recordedAt: string }>
      >(
        `*[_type == "performanceMetric" && sessionId in $sessionIds] | order(recordedAt desc) {
          sessionId,
          metric,
          value,
          recordedAt
        }`,
        { sessionIds }
      );

      const bySession = new Map<string, Array<{ metric: string; value: number; recordedAt: string }>>();
      for (const v of vitalsBySession) {
        if (!v.sessionId) continue;
        if (!bySession.has(v.sessionId)) bySession.set(v.sessionId, []);
        bySession.get(v.sessionId)!.push({
          metric: (v.metric ?? "").toLowerCase(),
          value: v.value ?? 0,
          recordedAt: v.recordedAt ?? "",
        });
      }

      itemsWithVitals = itemsWithVitals.map((row) => {
        const sessionVitals = bySession.get(row.sessionId ?? "") ?? [];
        const rowTime = new Date(row.recordedAt).getTime();
        const withinWindow = (t: string) => Math.abs(new Date(t).getTime() - rowTime) < 60_000;
        const lcp = sessionVitals.find((v) => v.metric === "lcp" && withinWindow(v.recordedAt));
        const fcp = sessionVitals.find((v) => v.metric === "fcp" && withinWindow(v.recordedAt));
        const cls = sessionVitals.find((v) => v.metric === "cls" && withinWindow(v.recordedAt));
        const ttfb = sessionVitals.find((v) => v.metric === "ttfb" && withinWindow(v.recordedAt));
        return {
          ...row,
          webVitals: {
            lcp: lcp?.value,
            fcp: fcp?.value,
            cls: cls?.value,
            ttfb: ttfb?.value,
          },
        };
      });
    }

    return NextResponse.json({
      items: itemsWithVitals,
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
