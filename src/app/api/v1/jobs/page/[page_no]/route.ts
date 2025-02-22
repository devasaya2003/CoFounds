import { NextRequest, NextResponse } from "next/server";
import { getAllJobsPaginated } from "@/backend/functions/job_application/GET/get_all_paginated";

export async function GET(req: NextRequest, { params }: { params: Promise<{page_no: string}> }) {
  const page_no = (await params).page_no;

  try {
    const page = parseInt(page_no, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const result = await getAllJobsPaginated(page);
    if (!result || !result.jobs.length) {
      return NextResponse.json({ error: `No jobs found for page ${page}` }, { status: 404 });
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching paginated jobs:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}