import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByRecruiterId } from "@/backend/functions/application_candidate_map/GET/get_by_recruiter_id";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ recruiter_id: string }> }
) {
  const recruiter_id = (await params).recruiter_id;
  try {
    if (!recruiter_id) {
      return NextResponse.json(
        { error: "recruiter id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByRecruiterId(recruiter_id);

    if (!applications) {
      return NextResponse.json(
        { error: `Applications with recruiter id ${recruiter_id} not found` },
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
