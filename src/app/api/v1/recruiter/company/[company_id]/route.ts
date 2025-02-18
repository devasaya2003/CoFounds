import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getRecruitersByCompanyId } from "@/backend/functions/company_recruiter_map/GET/get_by_company_id";

export async function GET(req: NextRequest, { params }: { params: Promise<{ company_id: string }> }) {
  const company_id = (await params).company_id

  try {
    if (!company_id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const recruiters = await getRecruitersByCompanyId(company_id);

    if (!recruiters) {
      return NextResponse.json({ error: `Recruiters with Company ID "${company_id}" not found` }, { status: 404 });
    }

    return NextResponse.json(recruiters, { status: 200 });
  } catch (error) {
    console.error("Error fetching Recruiters with Company ID:", error);
    return NextResponse.json({ error: "Failed to fetch Recruiters with Company ID" }, { status: 500 });
  }
}