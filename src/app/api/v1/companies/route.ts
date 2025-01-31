import { NextResponse } from "next/server";
import { getAllCompanies } from "@/backend/functions/company_master/GET/get_all";
import { createCompany } from "@/backend/functions/company_master/POST/create_company";

export async function GET() {
    try {
        const companies = await getAllCompanies();
        return NextResponse.json(companies, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
    }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.size || !data.url || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdCompany = await createCompany(data);

    return NextResponse.json(
      { message: "Company created successfully", createdCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
