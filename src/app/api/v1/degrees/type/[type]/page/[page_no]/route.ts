import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPaginatedDegreesByType } from "@/backend/functions/degree_master/GET/get_by_type_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; page_no: string }> }
) {
  const type = (await params).type;
  const page = parseInt((await params).page_no, 10);

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    const result = await getPaginatedDegreesByType(
      decodeURIComponent(type),
      page
    );
    if (!result || !result.degrees.length) {
      return NextResponse.json(
        { error: `No degrees of type: ${type} found for page ${page}` },
        { status: 404 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching paginated degrees:", error);
    return NextResponse.json(
      { error: "Failed to fetch degrees" },
      { status: 500 }
    );
  }
}
