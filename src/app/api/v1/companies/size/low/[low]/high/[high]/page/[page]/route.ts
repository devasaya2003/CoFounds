import { NextResponse } from "next/server";
import { getPaginatedCompaniesBySizeRange } from "@/backend/functions/company_master/GET/get_by_size_paginated";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ low: string; high: string; page_no: string }> }
) {
  try {
    let low = parseInt((await params).low) || 0;
    let high = parseInt((await params).high);
    let page = parseInt((await params).page_no) || 1;

    if (isNaN(high) || high < low) {
      return NextResponse.json(
        { error: "Invalid range. 'high' must be greater than or equal to 'low'." },
        { status: 400 }
      );
    }

    if (page < 1) {
      return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
    }

    const result = await getPaginatedCompaniesBySizeRange(low, high, page);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching paginated companies by size range:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies by size range." },
      { status: 500 }
    );
  }
}
