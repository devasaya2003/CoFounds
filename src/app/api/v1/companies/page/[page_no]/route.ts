import {NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getPaginatedCompanies } from "@/backend/functions/company_master/GET/paginated";

export async function GET(req: NextRequest, { params }: { params: Promise<{page_no: string}> }) {
  const page_no = (await params).page_no;

  try {
    const page = parseInt(page_no, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const result = await getPaginatedCompanies(page);
    if (!result || !result.companies.length) {
      return NextResponse.json({ error: `No companies found for page ${page}` }, { status: 404 });
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching paginated companies:", err);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}