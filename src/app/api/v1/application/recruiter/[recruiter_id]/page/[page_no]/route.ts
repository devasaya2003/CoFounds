import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByRecruiterIdPaginated } from "@/backend/functions/application_candidate_map/GET/get_by_recruiter_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ recruiter_id: string; page_no: string }> }
) {
  const recruiter_id = (await params).recruiter_id;
  const page = parseInt((await params).page_no, 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    if (!recruiter_id) {
      return NextResponse.json(
        { error: "recruiter id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByRecruiterIdPaginated(
      recruiter_id,
      page
    );

    if (!applications || !applications.applications.length) {
      return NextResponse.json(
        {
          error: `Applications with recruiter id ${recruiter_id} and page number ${page} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by recruiter id:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by recruiter id" },
      { status: 500 }
    );
  }
}
