import { NextResponse } from "next/server";
import { getAllRecruitersByCompanyIdPaginated } from "@/backend/functions/company_recruiter_map/GET/get_by_company_id_paginated";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ company_id: string; page_no: string }> }
) {
  try {
    const company_id = (await params).company_id;
    const page_no = parseInt((await params).page_no);

    if (!company_id) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    if (page_no < 1) {
      return NextResponse.json(
        { error: "Invalid page number." },
        { status: 400 }
      );
    }

    const result = await getAllRecruitersByCompanyIdPaginated(
      page_no,
      company_id
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching paginated Recruiters By Company ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch Recruiters By Company ID." },
      { status: 500 }
    );
  }
}
