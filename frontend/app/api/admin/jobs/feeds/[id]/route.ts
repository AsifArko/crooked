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
    if (typeof body.url === "string") patches.url = body.url;
    if (typeof body.category === "string" || body.category === null)
      patches.category = body.category || undefined;
    if (typeof body.feedType === "string") patches.feedType = body.feedType;
    if (typeof body.enabled === "boolean") patches.enabled = body.enabled;
    if (body.source && typeof body.source === "string")
      patches.source = { _type: "reference", _ref: body.source };

    if (Object.keys(patches).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await writeClient.patch(id).set(patches).commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feed PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}
