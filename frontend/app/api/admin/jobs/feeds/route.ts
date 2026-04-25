import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";
import { ensureJobSources } from "@/lib/jobs/crawler/ensure-sources";
import { ensureJobFeeds } from "@/lib/jobs/crawler/ensure-feeds";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body?.url;
    const sourceId = body?.source;
    if (!url || !sourceId) {
      return NextResponse.json(
        { error: "url and source are required" },
        { status: 400 }
      );
    }
    const sourceExists = await client.fetch<{ _id: string } | null>(
      `*[_type == "jobSource" && _id == $id][0]{ _id }`,
      { id: sourceId }
    );
    if (!sourceExists) {
      return NextResponse.json(
        { error: "Invalid source reference" },
        { status: 400 }
      );
    }
    const doc = await writeClient.create({
      _type: "jobFeed",
      url,
      source: { _type: "reference", _ref: sourceId },
      category: body.category || undefined,
      feedType: body.feedType || "rss",
      enabled: body.enabled !== false,
    });
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (error) {
    console.error("Feed POST error:", error);
    return NextResponse.json(
      { error: "Failed to create feed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const enabled = searchParams.get("enabled");
    const from = (page - 1) * limit;
    const to = from + limit;

    const filterParts = ['_type == "jobFeed"'];
    if (enabled === "true") filterParts.push("enabled == true");
    if (enabled === "false") filterParts.push("enabled == false");
    const filterStr = filterParts.join(" && ");

    let total = await client.fetch<number>(`count(*[${filterStr}])`);
    if (total === 0) {
      await ensureJobSources();
      await ensureJobFeeds();
      total = await client.fetch<number>(`count(*[${filterStr}])`);
    }

    const items = await client.fetch<
      Array<{
        _id: string;
        url: string;
        category?: string;
        feedType?: string;
        enabled: boolean;
        lastCrawledAt?: string;
        lastError?: string;
        source: { _id: string; slug?: string; name?: string } | null;
      }>
    >(
      `*[${filterStr}] | order(url asc)[$from...$to] {
        _id,
        url,
        category,
        feedType,
        enabled,
        lastCrawledAt,
        lastError,
        source->{ _id, slug, name }
      }`,
      { from, to }
    );

    return NextResponse.json({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Feeds API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}
