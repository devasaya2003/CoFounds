import { NextRequest, NextResponse } from "next/server";
import { getApplicationsByCompanyIdPaginated } from "@/backend/functions/application_candidate_map/GET/get_by_company_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ company_id: string; page_no: string }> }
) {
  const company_id = (await params).company_id;
  const page = parseInt((await params).page_no, 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  try {
    if (!company_id) {
      return NextResponse.json(
        { error: "company id is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByCompanyIdPaginated(
      company_id,
      page
    );

    if (!applications || !applications.applications.length) {
      return NextResponse.json(
        {
          error: `Applications with company id ${company_id} and page number ${page} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by company id:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by company id" },
      { status: 500 }
    );
  }
}
