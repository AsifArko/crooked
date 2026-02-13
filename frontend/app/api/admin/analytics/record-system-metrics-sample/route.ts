import { writeClient } from "@/sanity/lib/writeClient";
import { NextResponse } from "next/server";

export async function POST() {
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
        status: "Normal",
        recordedAt: now,
      }),
      writeClient.create({
        _type: "systemMetric",
        metricType: "memory_rss",
        value: rssMB,
        unit: "MB",
        status: "Normal",
        recordedAt: now,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Record system metrics sample error:", error);
    return NextResponse.json(
      { error: "Failed to record sample" },
      { status: 500 }
    );
  }
}
