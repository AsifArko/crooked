import { writeClient } from "@/sanity/lib/writeClient";
import { getClientIp } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = getClientIp(request.headers);

    await writeClient.create({
      _type: "pageView",
      url: body.url ?? "",
      sessionId: body.sessionId ?? "",
      ipAddress: ip,
      hostname: null,
      userAgent: body.userAgent ?? null,
      loadTimeMs: body.loadTimeMs ?? null,
      referrer: body.referrer ?? null,
      recordedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics page-view error:", error);
    return NextResponse.json(
      { error: "Failed to record page view" },
      { status: 500 }
    );
  }
}
