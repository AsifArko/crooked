import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

    const [totalJobs, jobsToday, jobsWithSource, jobsWithPlace, lastCrawl] =
      await Promise.all([
        client.fetch<number>(`count(*[_type == "jobListing"])`),
        client.fetch<number>(
          `count(*[_type == "jobListing" && postedAt >= $start && postedAt <= $end])`,
          { start: todayStart, end: todayEnd }
        ),
        client.fetch<Array<{ source: string }>>(
          `*[_type == "jobListing" && defined(source)] { "source": source->slug }`
        ),
        client.fetch<Array<{ countryCode: string; country: string }>>(
          `*[_type == "jobListing" && defined(place)] { "countryCode": place->countryCode, "country": place->country }`
        ),
        client.fetch<{ finishedAt: string } | null>(
          `*[_type == "crawlRun" && status == "completed"] | order(finishedAt desc)[0]{ finishedAt }`
        ),
      ]);

    const sourceCounts = new Map<string, number>();
    for (const r of jobsWithSource) {
      if (r?.source) {
        sourceCounts.set(r.source, (sourceCounts.get(r.source) ?? 0) + 1);
      }
    }
    const topSources = Array.from(sourceCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const countryCounts = new Map<string, { country: string; count: number }>();
    for (const r of jobsWithPlace) {
      if (r?.countryCode) {
        const cur = countryCounts.get(r.countryCode);
        countryCounts.set(r.countryCode, {
          country: r.country ?? r.countryCode,
          count: (cur?.count ?? 0) + 1,
        });
      }
    }
    const topCountries = Array.from(countryCounts.entries())
      .map(([countryCode, v]) => ({ countryCode, country: v.country, count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalJobs,
      jobsToday,
      topSources,
      topCountries,
      lastCrawledAt: lastCrawl?.finishedAt ?? undefined,
    });
  } catch (error) {
    console.error("Jobs overview API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
