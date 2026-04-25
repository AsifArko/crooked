import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const patches: Record<string, unknown> = {};
    if (typeof body.name === "string") patches.name = body.name;
    if (body.countryId) patches.country = { _type: "reference", _ref: body.countryId };
    if (typeof body.countryCode === "string" || body.countryCode === null)
      patches.countryCode = body.countryCode || undefined;
    if (typeof body.state === "string" || body.state === null) patches.state = body.state || undefined;
    if (typeof body.postcode === "string" || body.postcode === null)
      patches.postcode = body.postcode || undefined;
    if (Array.isArray(body.postcodes)) patches.postcodes = body.postcodes;
    if (typeof body.population === "number" || body.population === null)
      patches.population = body.population ?? undefined;
    if (typeof body.timezone === "string" || body.timezone === null)
      patches.timezone = body.timezone || undefined;
    if (typeof body.crawlEnabled === "boolean") patches.crawlEnabled = body.crawlEnabled;

    if (body.lat != null && body.lng != null) {
      patches.geolocation = {
        _type: "geopoint",
        lat: Number(body.lat),
        lng: Number(body.lng),
      };
    }

    if (Object.keys(patches).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await writeClient.patch(id).set(patches).commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("City PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update city" },
      { status: 500 }
    );
  }
}
