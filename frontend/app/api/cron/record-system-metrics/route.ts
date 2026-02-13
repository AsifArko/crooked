import { writeClient } from "@/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

function getStatus(value: number, unit: string): string {
  if (unit !== "MB") return "Normal";
  if (value > 400) return "Critical";
  if (value > 250) return "Warning";
  return "Normal";
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const mem = process.memoryUsage();
    const heapUsedMB = Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100;
    const rssMB = Math.round((mem.rss / 1024 / 1024) * 100) / 100;

    const now = new Date().toISOString();

    await Promise.all([
      writeClient.create({
        _type: "systemMetric",
        metricType: "memory_heap",
        value: heapUsedMB,
        unit: "MB",
        status: getStatus(heapUsedMB, "MB"),
        recordedAt: now,
      }),
      writeClient.create({
        _type: "systemMetric",
        metricType: "memory_rss",
        value: rssMB,
        unit: "MB",
        status: getStatus(rssMB, "MB"),
        recordedAt: now,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Record system metrics error:", error);
    return NextResponse.json(
      { error: "Failed to record system metrics" },
      { status: 500 }
    );
  }
}
