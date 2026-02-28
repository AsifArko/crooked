import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";
import { ensureJobSources } from "@/lib/jobs/crawler/ensure-sources";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body?.slug?.trim();
    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "jobSource" && slug == $slug][0]{ _id }`,
      { slug }
    );
    if (existing) {
      return NextResponse.json(
        { error: "Source with this slug already exists" },
        { status: 400 }
      );
    }
    const doc = await writeClient.create({
      _type: "jobSource",
      slug,
      name: body.name || undefined,
      url: body.url || undefined,
      attribution: body.attribution || undefined,
      sourceType: body.sourceType || undefined,
      enabled: body.enabled !== false,
      rateLimitPerMinute: body.rateLimitPerMinute,
    });
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (error) {
    console.error("Source POST error:", error);
    return NextResponse.json(
      { error: "Failed to create source" },
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
    const sourceType = searchParams.get("sourceType");
    const from = (page - 1) * limit;
    const to = from + limit;

    const filterParts = ['_type == "jobSource"'];
    if (enabled === "true") filterParts.push("enabled == true");
    if (enabled === "false") filterParts.push("enabled == false");
    if (sourceType) filterParts.push("sourceType == $sourceType");
    const filterStr = filterParts.join(" && ");

    let total = await client.fetch<number>(`count(*[${filterStr}])`, sourceType ? { sourceType } : {});
    if (total === 0 && !enabled && !sourceType) {
      await ensureJobSources();
      total = await client.fetch<number>(`count(*[_type == "jobSource"])`);
    }

    const params: Record<string, string | number> = { from, to };
    if (sourceType) params.sourceType = sourceType;

    const items = await client.fetch<
      Array<{
        _id: string;
        slug: string;
        name?: string;
        url?: string;
        attribution?: string;
        sourceType?: string;
        enabled: boolean;
        rateLimitPerMinute?: number;
      }>
    >(
      `*[${filterStr}] | order(slug asc)[$from...$to] {
        _id,
        slug,
        name,
        url,
        attribution,
        sourceType,
        enabled,
        rateLimitPerMinute
      }`,
      params
    );

    return NextResponse.json({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Sources API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}
