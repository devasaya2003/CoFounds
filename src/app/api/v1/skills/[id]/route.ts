import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSkillById } from "@/backend/functions/skill_master/GET/get_by_id"
import { updateSkill } from "@/backend/functions/skill_master/PUT/update_skill"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const resource = await getSkillById(id)

    if (!resource) {
      return NextResponse.json({ error: `Resource with ID ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(resource, { status: 200 })
  } catch (error) {
    console.error("Error fetching resource by ID:", error)
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    const data = await req.json()

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 })
    }

    const updatedResource = await updateSkill(id, data)

    return NextResponse.json({ message: "Resource updated successfully", updatedResource }, { status: 200 })
  } catch (error) {
    console.error("Error during resource update:", error)
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 })
  }
}