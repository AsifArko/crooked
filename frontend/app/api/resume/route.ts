import { client } from "@/sanity/lib/client";
import { resumeQuery } from "@/sanity/lib/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resume = await client.fetch(resumeQuery);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}
