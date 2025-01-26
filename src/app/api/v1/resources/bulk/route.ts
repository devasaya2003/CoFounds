import { createBulkResources } from "@/backend/functions/resource_master/POST/bulk_create";
import { updateBulkResources } from "@/backend/functions/resource_master/PUT/bulk_update";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const resources = await req.json();

    if (!Array.isArray(resources) || resources.length === 0) {
      return NextResponse.json({ error: "Resources must be a non-empty array" }, { status: 400 });
    }

    const createdResources = await createBulkResources(resources);

    return NextResponse.json(
      { message: "Resources created successfully", createdResources },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk resources:", error);
    return NextResponse.json({ error: "Failed to create bulk resources" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const resources = await req.json();
  
      if (!Array.isArray(resources) || resources.length === 0) {
        return NextResponse.json({ error: "Resources must be a non-empty array" }, { status: 400 });
      }
  
      // Call the bulk update function
      const updatedResources = await updateBulkResources(resources);
  
      return NextResponse.json({ message: "Resources updated successfully", updatedResources }, { status: 200 });
    } catch (error) {
      console.error("Error during bulk update:", error);
      return NextResponse.json({ error: "Failed to update resources" }, { status: 500 });
    }
  }