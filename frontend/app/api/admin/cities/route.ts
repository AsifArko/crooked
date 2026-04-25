import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const countryId = body?.countryId?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const geolocation =
      body.lat != null && body.lng != null
        ? { _type: "geopoint" as const, lat: Number(body.lat), lng: Number(body.lng) }
        : undefined;

    const doc = await writeClient.create({
      _type: "city",
      name,
      country: countryId ? { _type: "reference", _ref: countryId } : undefined,
      countryCode: body.countryCode?.trim() || undefined,
      state: body.state?.trim() || undefined,
      postcode: body.postcode?.trim() || undefined,
      postcodes: Array.isArray(body.postcodes) ? body.postcodes.filter(Boolean) : undefined,
      geolocation,
      population: typeof body.population === "number" ? body.population : undefined,
      timezone: body.timezone?.trim() || undefined,
      crawlEnabled: body.crawlEnabled !== false,
    });
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (error) {
    console.error("City POST error:", error);
    return NextResponse.json(
      { error: "Failed to create city" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const search = searchParams.get("search")?.trim() ?? "";
    const countryCode = searchParams.get("countryCode")?.trim() ?? "";
    const crawlEnabled = searchParams.get("crawlEnabled");
    const from = (page - 1) * limit;
    const to = from + limit;

    const filterParts = ['_type == "city"'];
    const params: Record<string, string | number> = { from, to };
    if (search?.length > 0) {
      filterParts.push("(name match $search || countryCode match $search)");
      params.search = `*${search}*`;
    }
    if (countryCode) {
      filterParts.push("countryCode == $countryCode");
      params.countryCode = countryCode;
    }
    if (crawlEnabled === "true") filterParts.push("crawlEnabled == true");
    if (crawlEnabled === "false") filterParts.push("crawlEnabled == false");
    const filterStr = filterParts.join(" && ");

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          name: string;
          countryCode?: string;
          country?: { _id: string; name?: string } | null;
          state?: string;
          postcode?: string;
          geolocation?: { lat?: number; lng?: number } | null;
          population?: number;
          timezone?: string;
          companiesCount?: number;
          lastCrawledAt?: string;
          crawlEnabled: boolean;
        }>
      >(
        `*[${filterStr}] | order(name asc)[$from...$to] {
          _id,
          name,
          countryCode,
          country->{ _id, name },
          state,
          postcode,
          geolocation,
          population,
          timezone,
          companiesCount,
          lastCrawledAt,
          crawlEnabled
        }`,
        params
      ),
      client.fetch<number>(`count(*[${filterStr}])`, params),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("Cities API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
