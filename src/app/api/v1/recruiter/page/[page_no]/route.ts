import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAllRecruitersPaginated } from "@/backend/functions/company_recruiter_map/GET/get_all_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page_no: string }> }
) {
  const page_no = (await params).page_no;

  try {
    const page = parseInt(page_no, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    const result = await getAllRecruitersPaginated(page);
    if (!result || !result.recruiters.length) {
      return NextResponse.json(
        { error: `No recruiters found for page ${page}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching paginated recruiters:", err);
    return NextResponse.json(
      { error: "Failed to fetch recruiters" },
      { status: 500 }
    );
  }
}
