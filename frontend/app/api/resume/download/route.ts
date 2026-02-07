import { writeClient } from "@/sanity/lib/writeClient";
import { getClientIp } from "@/lib/analytics";
import { client } from "@/sanity/lib/client";
import { resumeQuery } from "@/sanity/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const resume = await client.fetch<{ fileUrl?: string }>(resumeQuery);

    if (!resume?.fileUrl) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const ip = getClientIp(request.headers);
    const userAgent = request.headers.get("user-agent") ?? null;
    const referrer = request.headers.get("referer") ?? null;

    await writeClient.create({
      _type: "resumeDownload",
      ipAddress: ip,
      hostname: null,
      userAgent,
      sessionId: null,
      referrer,
      recordedAt: new Date().toISOString(),
    });

    return NextResponse.redirect(resume.fileUrl);
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to download resume" },
      { status: 500 }
    );
  }
}
