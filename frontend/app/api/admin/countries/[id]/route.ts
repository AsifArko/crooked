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
    if (typeof body.countryCode === "string") patches.countryCode = body.countryCode.toUpperCase();
    if (typeof body.slug === "string" || body.slug === null) patches.slug = body.slug || undefined;
    if (typeof body.region === "string" || body.region === null) patches.region = body.region || undefined;
    if (typeof body.population === "number" || body.population === null)
      patches.population = body.population ?? undefined;

    if (Object.keys(patches).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await writeClient.patch(id).set(patches).commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Country PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update country" },
      { status: 500 }
    );
  }
}
