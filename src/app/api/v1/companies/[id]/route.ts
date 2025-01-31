import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCompanyById } from "@/backend/functions/company_master/GET/get_by_id"
import { updateCompany } from "@/backend/functions/company_master/PUT/update_company"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const company = await getCompanyById(id)

    if (!company) {
      return NextResponse.json({ error: `Company with ID ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(company, { status: 200 })
  } catch (error) {
    console.error("Error fetching company by ID:", error)
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    const data = await req.json()

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 })
    }

    const updatedCompany = await updateCompany(id, data)

    return NextResponse.json({ message: "Company updated successfully", updatedCompany }, { status: 200 })
  } catch (error) {
    console.error("Error during company update:", error)
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
  }
}