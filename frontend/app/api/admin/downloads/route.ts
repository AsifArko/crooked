import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const from = (page - 1) * limit;
    const to = from + limit;

    const [items, total] = await Promise.all([
      client.fetch<
        Array<{
          _id: string;
          ipAddress?: string;
          hostname?: string;
          userAgent?: string;
          sessionId?: string;
          referrer?: string;
          recordedAt: string;
        }>
      >(
        `*[_type == "resumeDownload"] | order(recordedAt desc) [$from...$to] {
          _id,
          ipAddress,
          hostname,
          userAgent,
          sessionId,
          referrer,
          recordedAt
        }`,
        { from, to }
      ),
      client.fetch<number>(`count(*[_type == "resumeDownload"])`),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      summary: {
        totalDownloads: total,
      },
    });
  } catch (error) {
    console.error("Downloads API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch downloads" },
      { status: 500 }
    );
  }
}
