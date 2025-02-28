import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByCandidateIdPaginated } from "@/backend/functions/application_candidate_map/GET/get_by_candidate_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ candidate_id: string; page_no: string }> }
) {
  const candidate_id = (await params).candidate_id;
  const page = parseInt((await params).page_no, 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    if (!candidate_id) {
      return NextResponse.json(
        { error: "candidate id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByCandidateIdPaginated(candidate_id, page);

    if (!applications || !applications.applications.length) {
      return NextResponse.json(
        { error: `Applications with candidate id ${candidate_id} and page number ${page} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by candidate id:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by candidate id" },
      { status: 500 }
    );
  }
}
