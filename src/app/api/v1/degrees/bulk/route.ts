import { NextResponse } from "next/server";
import { createBulkDegrees } from "@/backend/functions/degree_master/POST/bulk_create";
import { updateBulkDegrees } from "@/backend/functions/degree_master/PUT/bulk_update";

export async function POST(req: Request) {
  try {
    const degrees = await req.json();

    if (!Array.isArray(degrees) || degrees.length === 0) {
      return NextResponse.json({ error: "Degrees must be a non-empty array" }, { status: 400 });
    }

    const createdDegrees = await createBulkDegrees(degrees);

    return NextResponse.json(
      { message: "Degrees created successfully", createdDegrees },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk degrees:", error);
    return NextResponse.json({ error: "Failed to create bulk degrees" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const degrees = await req.json();
  
      if (!Array.isArray(degrees) || degrees.length === 0) {
        return NextResponse.json({ error: "Degrees must be a non-empty array" }, { status: 400 });
      }
  
      // Call the bulk update function
      const updatedDegrees = await updateBulkDegrees(degrees);
  
      return NextResponse.json({ message: "Degrees updated successfully", updatedDegrees }, { status: 200 });
    } catch (error) {
      console.error("Error during bulk update:", error);
      return NextResponse.json({ error: "Failed to update degrees" }, { status: 500 });
    }
  }