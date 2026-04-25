import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const countryCode = body?.countryCode?.trim()?.toUpperCase();
    if (!name || !countryCode) {
      return NextResponse.json(
        { error: "name and countryCode are required" },
        { status: 400 }
      );
    }
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "country" && countryCode == $countryCode][0]{ _id }`,
      { countryCode }
    );
    if (existing) {
      return NextResponse.json(
        { error: "Country with this code already exists" },
        { status: 400 }
      );
    }
    const doc = await writeClient.create({
      _type: "country",
      name,
      countryCode,
      slug: body.slug?.trim() || countryCode.toLowerCase(),
      region: body.region?.trim() || undefined,
      population: typeof body.population === "number" ? body.population : undefined,
    });
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (error) {
    console.error("Country POST error:", error);
    return NextResponse.json(
      { error: "Failed to create country" },
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
    const from = (page - 1) * limit;
    const to = from + limit;

    let filterStr = '_type == "country"';
    const params: Record<string, string | number> = { from, to };
    if (search?.length > 0) {
      filterStr += ' && (name match $search || countryCode match $search)';
      params.search = `*${search}*`;
    }

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          name: string;
          countryCode: string;
          slug?: string;
          region?: string;
          population?: number;
          lastSyncedAt?: string;
        }>
      >(
        `*[${filterStr}] | order(name asc)[$from...$to] {
          _id,
          name,
          countryCode,
          slug,
          region,
          population,
          lastSyncedAt
        }`,
        params
      ),
      client.fetch<number>(`count(*[${filterStr}])`, params),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("Countries API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
