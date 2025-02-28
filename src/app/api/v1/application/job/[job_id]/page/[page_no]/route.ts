import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByJobIdPaginated } from "@/backend/functions/application_candidate_map/GET/get_by_job_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string; page_no: string }> }
) {
  const job_id = (await params).job_id;
  const page = parseInt((await params).page_no, 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    if (!job_id) {
      return NextResponse.json(
        { error: "job id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByJobIdPaginated(
      job_id,
      page
    );

    if (!applications || !applications.applications.length) {
      return NextResponse.json(
        {
          error: `Applications with job id ${job_id} and page number ${page} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by job id:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by job id" },
      { status: 500 }
    );
  }
}
