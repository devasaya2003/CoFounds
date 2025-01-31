import { NextResponse } from "next/server";
import { createBulkCompanies } from "@/backend/functions/company_master/POST/bulk_create";
import { updateBulkCompanies } from "@/backend/functions/company_master/PUT/bulk_update";

export async function POST(req: Request) {
  try {
    const companies = await req.json();

    if (!Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json({ error: "Companies must be a non-empty array" }, { status: 400 });
    }

    const createdCompanies = await createBulkCompanies(companies);

    return NextResponse.json(
      { message: "Companies created successfully", createdCompanies },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk companies:", error);
    return NextResponse.json({ error: "Failed to create bulk companies" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const companies = await req.json();
  
      if (!Array.isArray(companies) || companies.length === 0) {
        return NextResponse.json({ error: "Companies must be a non-empty array" }, { status: 400 });
      }
  
      // Call the bulk update function
      const updatedCompanies = await updateBulkCompanies(companies);
  
      return NextResponse.json({ message: "Companies updated successfully", updatedCompanies }, { status: 200 });
    } catch (error) {
      console.error("Error during bulk update:", error);
      return NextResponse.json({ error: "Failed to update companies" }, { status: 500 });
    }
  }