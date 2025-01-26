import { NextResponse } from "next/server";
import { getAllResources } from "@/backend/functions/resource_master/GET/get_all";
import { createResource } from "@/backend/functions/resource_master/POST/create_resource";

export async function GET() {
  try {
    const resources = await getAllResources();
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.link || !data.image || !data.created_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdResource = await createResource(data);

    return NextResponse.json(
      { message: "Resource created successfully", createdResource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
