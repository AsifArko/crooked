import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await writeClient.create({
      _type: "systemMetric",
      metricType: body.metricType ?? "unknown",
      value: typeof body.value === "number" ? body.value : 0,
      unit: body.unit ?? "",
      status: body.status ?? "Normal",
      recordedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("System metric API error:", error);
    return NextResponse.json(
      { error: "Failed to record system metric" },
      { status: 500 }
    );
  }
}
