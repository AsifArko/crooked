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
    if (typeof body.slug === "string") patches.slug = body.slug;
    if (typeof body.name === "string" || body.name === null) patches.name = body.name || undefined;
    if (typeof body.url === "string" || body.url === null) patches.url = body.url || undefined;
    if (typeof body.attribution === "string" || body.attribution === null)
      patches.attribution = body.attribution || undefined;
    if (typeof body.sourceType === "string" || body.sourceType === null)
      patches.sourceType = body.sourceType || undefined;
    if (typeof body.enabled === "boolean") patches.enabled = body.enabled;
    if (typeof body.rateLimitPerMinute === "number" || body.rateLimitPerMinute === null)
      patches.rateLimitPerMinute = body.rateLimitPerMinute ?? undefined;

    if (Object.keys(patches).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await writeClient.patch(id).set(patches).commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Source PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update source" },
      { status: 500 }
    );
  }
}
