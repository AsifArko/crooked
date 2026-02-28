import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getCountrySearchPattern(code: string): string {
  const map: Record<string, string> = {
    US: "United States",
    USA: "United States",
    GB: "United Kingdom",
    UK: "United Kingdom",
    DE: "Germany",
    FR: "France",
    IN: "India",
    AU: "Australia",
    CA: "Canada",
    NL: "Netherlands",
    ES: "Spain",
    IT: "Italy",
    BR: "Brazil",
    MX: "Mexico",
    PL: "Poland",
    SG: "Singapore",
    ZA: "South Africa",
    AT: "Austria",
    NZ: "New Zealand",
    RU: "Russia",
  };
  const pattern = map[code.toUpperCase()] ?? code;
  return `*${pattern}*`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const search = searchParams.get("search")?.trim() ?? "";
    const countryCode = searchParams.get("countryCode")?.trim() ?? "";
    const location = searchParams.get("location")?.trim() ?? "";
    const remote = searchParams.get("remote") ?? "";
    const source = searchParams.get("source")?.trim() ?? "";
    const dateFrom = searchParams.get("dateFrom") ?? "";
    const dateTo = searchParams.get("dateTo") ?? "";

    const filters: string[] = ['_type == "jobListing"'];

    if (countryCode) {
      filters.push(`(place->countryCode == $countryCode || (defined(locationRaw) && locationRaw match $countryPattern))`);
    }
    if (location) {
      filters.push(`(defined(locationRaw) && locationRaw match $locationMatch)`);
    }
    if (remote === "true") {
      filters.push(`remote == true`);
    } else if (remote === "false") {
      filters.push(`remote == false`);
    }
    if (source) {
      filters.push(`source->slug == $source`);
    }
    if (dateFrom) {
      filters.push(`postedAt >= $dateFrom`);
    }
    if (dateTo) {
      filters.push(`postedAt <= $dateTo`);
    }

    const filterStr = filters.join(" && ");
    const baseQuery = `*[${filterStr}] | order(postedAt desc)`;
    const from = (page - 1) * limit;
    const to = from + limit;
    const hasSearch = search.length > 0;

    const params: Record<string, string> = {};
    if (countryCode) {
      params.countryCode = countryCode;
      params.countryPattern = getCountrySearchPattern(countryCode);
    }
    if (location) params.locationMatch = `*${location}*`;
    if (source) params.source = source;
    if (dateFrom) params.dateFrom = `${dateFrom}T00:00:00.000Z`;
    if (dateTo) params.dateTo = `${dateTo}T23:59:59.999Z`;

    const fetchSlice = hasSearch ? `[0...500]` : `[$from...$to]`;
    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          title: string;
          companyName: string;
          description?: string;
          url: string;
          locationRaw: string;
          remote: boolean;
          postedAt: string;
          jobType?: string;
          category?: string;
          tags?: string[];
          salaryMin?: number;
          salaryMax?: number;
          currency?: string;
          urlDomain?: string;
          source: { name?: string; slug?: string } | null;
          place: { name?: string; displayName?: string; country?: string; countryCode?: string } | null;
        }>
      >(
        `${baseQuery} ${fetchSlice} {
          _id,
          title,
          companyName,
          description,
          url,
          locationRaw,
          remote,
          postedAt,
          jobType,
          category,
          tags,
          salaryMin,
          salaryMax,
          currency,
          urlDomain,
          source->{ name, slug },
          place->{ name, displayName, country, countryCode }
        }`,
        hasSearch ? params : { ...params, from, to }
      ),
      client.fetch<number>(`count(*[${filterStr}])`, params),
    ]);

    let filteredItems = items;
    if (hasSearch) {
      const q = search.toLowerCase();
      filteredItems = items.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.companyName?.toLowerCase().includes(q) ||
          i.locationRaw?.toLowerCase().includes(q)
      );
    }

    const actualTotal = hasSearch ? filteredItems.length : total;
    const paginated = hasSearch
      ? filteredItems.slice(from, from + limit)
      : filteredItems;

    return NextResponse.json({
      items: paginated,
      total: actualTotal,
      page,
      limit,
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
