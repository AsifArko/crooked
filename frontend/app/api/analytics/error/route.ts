import { writeClient } from "@/sanity/lib/writeClient";
import { getClientIp } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = getClientIp(request.headers);

    await writeClient.create({
      _type: "errorLog",
      errorType: body.errorType ?? "client",
      message: body.message ?? "Unknown error",
      severity: body.severity ?? "medium",
      url: body.url ?? null,
      ipAddress: ip,
      hostname: null,
      stackTrace: body.stackTrace ?? null,
      status: "Open",
      recordedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics error-log error:", error);
    return NextResponse.json(
      { error: "Failed to record error" },
      { status: 500 }
    );
  }
}
