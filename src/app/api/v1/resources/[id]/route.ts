import { NextResponse } from "next/server";
import { getResourceById } from "@/backend/functions/resource_master/GET/get_by_id";
import { updateResource } from "@/backend/functions/resource_master/PUT/update_resource";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const resource = await getResourceById(id);

    if (!resource) {
      return NextResponse.json({ error: `Resource with ID ${id} not found` }, { status: 404 });
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    // Check if there is data to update
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }

    // Call the updateResource function
    const updatedResource = await updateResource(id, data);

    return NextResponse.json({ message: "Resource updated successfully", updatedResource }, { status: 200 });
  } catch (error) {
    console.error("Error during resource update:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}