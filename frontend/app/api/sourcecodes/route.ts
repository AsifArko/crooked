import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { sourceCodesQuery } from "@/sanity/lib/queries";

export async function GET() {
  try {
    const sourceCodes = await client.fetch(sourceCodesQuery);
    return NextResponse.json(sourceCodes);
  } catch (error) {
    console.error("Error fetching source codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch source codes" },
      { status: 500 }
    );
  }
}
