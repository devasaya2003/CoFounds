import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getRecruiterById } from "@/backend/functions/company_recruiter_map/GET/get_by_id"
import { updateRecruiter } from "@/backend/functions/company_recruiter_map/PUT/update_recruiter";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const recruiter = await getRecruiterById(id)

    if (!recruiter) {
      return NextResponse.json({ error: `Recruiter with ID ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(recruiter, { status: 200 })
  } catch (error) {
    console.error("Error fetching recruiter by ID:", error)
    return NextResponse.json({ error: "Failed to fetch recruiter" }, { status: 500 })
  }
}