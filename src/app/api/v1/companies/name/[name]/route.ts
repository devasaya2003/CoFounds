import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getCompanyByName } from "@/backend/functions/company_master/GET/get_by_name";

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name

  try {
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const company = await getCompanyByName(decodeURIComponent(name));

    if (!company) {
      return NextResponse.json({ error: `Company with name "${name}" not found` }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error fetching company by name:", error);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}