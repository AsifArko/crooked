import { writeClient } from "@/sanity/lib/writeClient";
import { getClientIp } from "@/lib/analytics";
import { client } from "@/sanity/lib/client";
import { resumeQuery } from "@/sanity/lib/queries";
import { NextRequest, NextResponse } from "next/server";

/** Safe filename for Content-Disposition: only alphanumeric, dash, underscore, dot */
function safeDownloadFilename(name: string | undefined): string {
  if (!name || typeof name !== "string") return "resume.pdf";
  const base = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${base || "resume"}.pdf`;
}

export async function GET(request: NextRequest) {
  try {
    const resume = await client.fetch<{
      fileUrl?: string;
      name?: string;
    }>(resumeQuery);

    if (!resume?.fileUrl) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const ip = getClientIp(request.headers);
    const userAgent = request.headers.get("user-agent") ?? null;
    const referrer = request.headers.get("referer") ?? null;
    const sessionId = request.headers.get("x-session-id")?.trim() || null;

    try {
      await writeClient.create({
        _type: "resumeDownload",
        ipAddress: ip,
        hostname: null,
        userAgent,
        sessionId,
        referrer,
        recordedAt: new Date().toISOString(),
      });
    } catch (trackingError) {
      // Log but don't block the download (e.g. missing/invalid SANITY_API_WRITE_TOKEN in production)
      console.error("Resume download tracking failed:", trackingError);
    }

    // Proxy the file from Sanity CDN so the URL is never exposed and browser gets a direct download
    const fileRes = await fetch(resume.fileUrl, { cache: "no-store" });
    if (!fileRes.ok) {
      console.error("Resume fetch from CDN failed:", fileRes.status);
      return NextResponse.json(
        { error: "Failed to fetch resume file" },
        { status: 502 },
      );
    }

    const contentType =
      fileRes.headers.get("content-type") ?? "application/pdf";
    const filename = safeDownloadFilename(resume.name);

    return new NextResponse(fileRes.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to download resume" },
      { status: 500 },
    );
  }
}
