import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const doc = await writeClient.create({
      _type: "company",
      name,
      slug: body.slug?.trim() || undefined,
      website: body.website?.trim() || undefined,
      description: body.description?.trim() || undefined,
      industry: body.industry || undefined,
      city: body.cityId ? { _type: "reference", _ref: body.cityId } : undefined,
      country: body.countryId ? { _type: "reference", _ref: body.countryId } : undefined,
      addressRaw: body.addressRaw?.trim() || undefined,
      employeeCount: body.employeeCount?.trim() || undefined,
      foundedYear: typeof body.foundedYear === "number" ? body.foundedYear : undefined,
      linkedInUrl: body.linkedInUrl?.trim() || undefined,
      crawlSource: body.crawlSource || undefined,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : undefined,
    });
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (error) {
    console.error("Company POST error:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
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
    const industry = searchParams.get("industry")?.trim() ?? "";
    const cityId = searchParams.get("cityId")?.trim() ?? "";
    const from = (page - 1) * limit;
    const to = from + limit;

    let filterStr = '_type == "company"';
    const params: Record<string, string | number> = { from, to };
    if (search?.length > 0) {
      filterStr += ' && (name match $search || defined(description) && description match $search)';
      params.search = `*${search}*`;
    }
    if (countryCode) {
      filterStr += " && country->countryCode == $countryCode";
      params.countryCode = countryCode;
    }
    if (industry) {
      filterStr += " && industry == $industry";
      params.industry = industry;
    }
    if (cityId) {
      filterStr += " && city._ref == $cityId";
      params.cityId = cityId;
    }

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          name: string;
          slug?: string;
          website?: string;
          industry?: string;
          city?: { _id: string; name?: string } | null;
          country?: { _id: string; name?: string; countryCode?: string } | null;
          employeeCount?: string;
          foundedYear?: number;
          crawlSource?: string;
          lastCrawledAt?: string;
        }>
      >(
        `*[${filterStr}] | order(name asc)[$from...$to] {
          _id,
          name,
          slug,
          website,
          industry,
          city->{ _id, name },
          country->{ _id, name, countryCode },
          employeeCount,
          foundedYear,
          crawlSource,
          lastCrawledAt
        }`,
        params
      ),
      client.fetch<number>(`count(*[${filterStr}])`, params),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("Companies API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
