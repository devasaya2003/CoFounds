import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByCandidateAndCompanyId } from "@/backend/functions/application_candidate_map/GET/get_by_candidate_company";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ candidate_id: string; company_id: string }> }
) {
  const candidate_id = (await params).candidate_id;
  const company_id = (await params).company_id;

  try {
    if (!candidate_id || !company_id) {
      return NextResponse.json(
        { error: "candidate id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByCandidateAndCompanyId(candidate_id, company_id);

    if (!applications) {
      return NextResponse.json(
        { error: `Applications with candidate id ${candidate_id} and company_id ${company_id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by candidate id and company_id:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by candidate id and company_id" },
      { status: 500 }
    );
  }
}
