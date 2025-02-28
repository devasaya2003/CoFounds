import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByCompanyId } from "@/backend/functions/application_candidate_map/GET/get_by_company";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ company_id: string }> }
) {
  const company_id = (await params).company_id;
  try {
    if (!company_id) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByCompanyId(company_id);

    if (!applications) {
      return NextResponse.json(
        { error: `Applications with Company ID ${company_id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by Company ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by Company ID" },
      { status: 500 }
    );
  }
}
