import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getByUserID } from "@/backend/functions/company_recruiter_map/GET/get_by_user_id";
import { updateRecruiter } from "@/backend/functions/company_recruiter_map/PUT/update_recruiter";

export async function GET(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const user_Id = (await params).user_id

  try {
    if (!user_Id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const recruiter = await getByUserID(decodeURIComponent(user_Id));

    if (!recruiter) {
      return NextResponse.json({ error: `Recruiter with user id "${user_Id}" not found` }, { status: 404 });
    }

    return NextResponse.json(recruiter, { status: 200 });
  } catch (error) {
    console.error("Error fetching Recruiter with user id:", error);
    return NextResponse.json({ error: "Failed to fetch Recruiter with user id" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const user_Id = (await params).user_id

  try {
    const data = await req.json()

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 })
    }

    const updatedRecruiter = await updateRecruiter(user_Id, data)

    return NextResponse.json({ message: "Recruiter updated successfully", updatedRecruiter }, { status: 200 })
  } catch (error) {
    console.error("Error during recruiter update:", error)
    return NextResponse.json({ error: "Failed to update recruiter" }, { status: 500 })
  }
}