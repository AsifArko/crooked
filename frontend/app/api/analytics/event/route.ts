import { writeClient } from "@/sanity/lib/writeClient";
import { getClientIp } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = getClientIp(request.headers);

    await writeClient.create({
      _type: "userEvent",
      eventType: body.eventType ?? "unknown",
      eventName: body.eventName ?? "unknown",
      url: body.url ?? null,
      sessionId: body.sessionId ?? "",
      ipAddress: ip,
      hostname: null,
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      recordedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics event error:", error);
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }
}
