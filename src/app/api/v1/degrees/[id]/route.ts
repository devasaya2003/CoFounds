import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getDegreeById } from "@/backend/functions/degree_master/GET/get_by_id"
import { updateDegree } from "@/backend/functions/degree_master/PUT/update_degree"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const degree = await getDegreeById(id)

    if (!degree) {
      return NextResponse.json({ error: `Degree with ID ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(degree, { status: 200 })
  } catch (error) {
    console.error("Error fetching degree by ID:", error)
    return NextResponse.json({ error: "Failed to fetch degree" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    const data = await req.json()

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 })
    }

    const updatedDegree = await updateDegree(id, data)

    return NextResponse.json({ message: "Degree updated successfully", updatedDegree }, { status: 200 })
  } catch (error) {
    console.error("Error during degree update:", error)
    return NextResponse.json({ error: "Failed to update degree" }, { status: 500 })
  }
}