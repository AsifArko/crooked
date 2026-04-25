import { writeClient } from "@/sanity/lib/writeClient";
import { getClientIp } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const ip = getClientIp(request.headers);

    await writeClient.create({
      _type: "performanceMetric",
      metric: body.metric ?? "unknown",
      value: body.value ?? 0,
      url: body.url ?? null,
      sessionId: body.sessionId ?? null,
      ipAddress: ip,
      hostname: null,
      recordedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics performance error:", error);
    return NextResponse.json(
      { error: "Failed to record performance metric" },
      { status: 500 }
    );
  }
}
