import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SourceStat = {
  source: string;
  fetched: number;
  created: number;
  updated: number;
  errors: number;
};

type LocationStat = {
  city: string;
  country: string;
  queries: number;
  jobsFound: number;
  created: number;
  updated: number;
};

export type UnifiedCrawlRun = {
  _id: string;
  type: "jobs" | "companies" | "geography";
  typeLabel: string;
  startedAt: string;
  finishedAt: string;
  status: string;
  trigger?: string;
  params?: Record<string, unknown>;
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalErrors: number;
  sourcesCount: number;
  durationMs?: number;
  sourceStats?: SourceStat[];
  locationStats?: LocationStat[];
  errorLog?: string;
  // Geography-specific
  citiesCreated?: number;
  citiesUpdated?: number;
  citiesErrors?: number;
  countriesCreated?: number;
  countriesUpdated?: number;
  log?: string[];
}

type CrawlRunDoc = {
  _type: "crawlRun";
  _id: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  crawlType?: string;
  trigger?: string;
  params?: Record<string, unknown>;
  totalJobs?: number;
  totalCreated?: number;
  totalUpdated?: number;
  durationMs?: number;
  sourceStats?: SourceStat[];
  locationStats?: LocationStat[];
  errorLog?: string;
};

type CompanyCrawlRunDoc = {
  _type: "companyCrawlRun";
  _id: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  trigger?: string;
  params?: Record<string, unknown>;
  totalFetched?: number;
  totalCreated?: number;
  totalUpdated?: number;
  totalErrors?: number;
  durationMs?: number;
  errorLog?: string;
};

type GeographySeedRunDoc = {
  _type: "geographySeedRun";
  _id: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  mode?: string;
  params?: Record<string, unknown>;
  citiesCreated?: number;
  citiesUpdated?: number;
  citiesErrors?: number;
  countriesCreated?: number;
  countriesUpdated?: number;
  durationMs?: number;
  errorLog?: string;
  log?: string[];
};

type AnyCrawlDoc = CrawlRunDoc | CompanyCrawlRunDoc | GeographySeedRunDoc;

function toUnified(doc: AnyCrawlDoc): UnifiedCrawlRun {
  if (doc._type === "crawlRun") {
    const r = doc as CrawlRunDoc;
    const totalFetched =
      r.totalJobs ??
      r.sourceStats?.reduce((s, x) => s + (x.fetched ?? 0), 0) ??
      0;
    const totalCreated =
      r.totalCreated ??
      r.sourceStats?.reduce((s, x) => s + (x.created ?? 0), 0) ??
      0;
    const totalUpdated =
      r.totalUpdated ??
      r.sourceStats?.reduce((s, x) => s + (x.updated ?? 0), 0) ??
      0;
    const totalErrors =
      r.sourceStats?.reduce((s, x) => s + (x.errors ?? 0), 0) ?? 0;
    const crawlType = r.crawlType ?? "jobs";
    const typeLabel =
      crawlType === "feeds"
        ? "RSS Feeds"
        : crawlType === "locations"
          ? "Locations"
          : "Jobs";
    return {
      _id: r._id,
      type: "jobs",
      typeLabel,
      startedAt: r.startedAt ?? "",
      finishedAt: r.finishedAt ?? "",
      status: r.status ?? "",
      trigger: r.trigger,
      params: r.params,
      totalFetched,
      totalCreated,
      totalUpdated,
      totalErrors,
      sourcesCount: r.sourceStats?.length ?? 0,
      durationMs: r.durationMs,
      sourceStats: r.sourceStats ?? [],
      locationStats: r.locationStats ?? [],
      errorLog: r.errorLog,
    };
  }

  if (doc._type === "companyCrawlRun") {
    const r = doc as CompanyCrawlRunDoc;
    return {
      _id: r._id,
      type: "companies",
      typeLabel: "Companies",
      startedAt: r.startedAt ?? "",
      finishedAt: r.finishedAt ?? "",
      status: r.status ?? "",
      trigger: r.trigger,
      params: r.params,
      totalFetched: r.totalFetched ?? 0,
      totalCreated: r.totalCreated ?? 0,
      totalUpdated: r.totalUpdated ?? 0,
      totalErrors: r.totalErrors ?? 0,
      sourcesCount: 0,
      durationMs: r.durationMs,
      errorLog: r.errorLog,
    };
  }

  if (doc._type === "geographySeedRun") {
    const r = doc as GeographySeedRunDoc;
    const citiesCreated = r.citiesCreated ?? 0;
    const citiesUpdated = r.citiesUpdated ?? 0;
    const countriesCreated = r.countriesCreated ?? 0;
    const countriesUpdated = r.countriesUpdated ?? 0;
    const mode = r.mode ?? "";
    const typeLabel =
      mode === "countries"
        ? "Country"
        : mode === "cities" || mode === "cities_all"
          ? "City"
          : "Geography";
    return {
      _id: r._id,
      type: "geography",
      typeLabel,
      startedAt: r.startedAt ?? "",
      finishedAt: r.finishedAt ?? "",
      status: r.status ?? "",
      trigger: "manual",
      params: r.params,
      totalFetched: r.citiesCreated ?? 0,
      totalCreated: citiesCreated + countriesCreated,
      totalUpdated: citiesUpdated + countriesUpdated,
      totalErrors: r.citiesErrors ?? 0,
      sourcesCount: 0,
      durationMs: r.durationMs,
      errorLog: r.errorLog,
      citiesCreated,
      citiesUpdated,
      citiesErrors: r.citiesErrors,
      countriesCreated,
      countriesUpdated,
      log: r.log,
    };
  }

  return {
    _id: doc._id,
    type: "jobs",
    typeLabel: "Unknown",
    startedAt: "",
    finishedAt: "",
    status: "",
    totalFetched: 0,
    totalCreated: 0,
    totalUpdated: 0,
    totalErrors: 0,
    sourcesCount: 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") ?? "20", 10)));
    const typeFilter = searchParams.get("type")?.trim(); // jobs, companies, geography

    const filterParts = [
      '_type in ["crawlRun", "companyCrawlRun", "geographySeedRun"]',
    ];
    if (typeFilter === "jobs") filterParts.push('_type == "crawlRun"');
    if (typeFilter === "companies") filterParts.push('_type == "companyCrawlRun"');
    if (typeFilter === "geography") filterParts.push('_type == "geographySeedRun"');
    const filterStr = filterParts.join(" && ");

    const from = (page - 1) * limit;
    const to = from + limit;

    const [items, total] = await Promise.all([
      client.fetch<AnyCrawlDoc[]>(
        `*[${filterStr}] | order(startedAt desc)[$from...$to] {
          _type,
          _id,
          startedAt,
          finishedAt,
          status,
          crawlType,
          trigger,
          params,
          totalJobs,
          totalCreated,
          totalUpdated,
          totalFetched,
          totalErrors,
          durationMs,
          sourceStats,
          locationStats,
          errorLog,
          mode,
          citiesCreated,
          citiesUpdated,
          citiesErrors,
          countriesCreated,
          countriesUpdated,
          log
        }`,
        { from, to }
      ),
      client.fetch<number>(`count(*[${filterStr}])`),
    ]);

    const runs = items.map(toUnified);

    return NextResponse.json({
      items: runs,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Unified crawls API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch crawls" },
      { status: 500 }
    );
  }
}
