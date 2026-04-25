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
    if (typeof body.slug === "string" || body.slug === null) patches.slug = body.slug || undefined;
    if (typeof body.website === "string" || body.website === null)
      patches.website = body.website || undefined;
    if (typeof body.description === "string" || body.description === null)
      patches.description = body.description || undefined;
    if (typeof body.industry === "string" || body.industry === null)
      patches.industry = body.industry || undefined;
    if (body.cityId) patches.city = { _type: "reference", _ref: body.cityId };
    if (body.countryId) patches.country = { _type: "reference", _ref: body.countryId };
    if (typeof body.addressRaw === "string" || body.addressRaw === null)
      patches.addressRaw = body.addressRaw || undefined;
    if (typeof body.employeeCount === "string" || body.employeeCount === null)
      patches.employeeCount = body.employeeCount || undefined;
    if (typeof body.foundedYear === "number" || body.foundedYear === null)
      patches.foundedYear = body.foundedYear ?? undefined;
    if (typeof body.linkedInUrl === "string" || body.linkedInUrl === null)
      patches.linkedInUrl = body.linkedInUrl || undefined;
    if (typeof body.crawlSource === "string" || body.crawlSource === null)
      patches.crawlSource = body.crawlSource || undefined;
    if (Array.isArray(body.tags)) patches.tags = body.tags;

    if (Object.keys(patches).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await writeClient.patch(id).set(patches).commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Company PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}
