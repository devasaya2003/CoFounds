import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByCandidateId } from "@/backend/functions/application_candidate_map/GET/get_by_candidate";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ candidate_id: string }> }
) {
  const candidate_id = (await params).candidate_id;
  try {
    if (!candidate_id) {
      return NextResponse.json(
        { error: "candidate id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByCandidateId(candidate_id);

    if (!applications) {
      return NextResponse.json(
        { error: `Applications with candidate id ${candidate_id} not found` },
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
