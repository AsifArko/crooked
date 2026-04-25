import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [total, crawlEnabled] = await Promise.all([
      client.fetch<number>(`count(*[_type == "city"])`),
      client.fetch<number>(`count(*[_type == "city" && crawlEnabled == true])`),
    ]);
    return NextResponse.json({ total, crawlEnabled });
  } catch (error) {
    console.error("Cities stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
