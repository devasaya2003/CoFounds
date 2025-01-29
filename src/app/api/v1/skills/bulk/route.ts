import { createBulkSkills } from "@/backend/functions/skill_master/POST/bulk_create";
import { updateBulkSkills } from "@/backend/functions/skill_master/PUT/bulk_update";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const skills = await req.json();

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: "skills must be a non-empty array" }, { status: 400 });
    }

    const createdskills = await createBulkSkills(skills);

    return NextResponse.json(
      { message: "skills created successfully", createdskills },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk skills:", error);
    return NextResponse.json({ error: "Failed to create bulk skills" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const skills = await req.json();
  
      if (!Array.isArray(skills) || skills.length === 0) {
        return NextResponse.json({ error: "skills must be a non-empty array" }, { status: 400 });
      }
  
      // Call the bulk update function
      const updatedskills = await updateBulkSkills(skills);
  
      return NextResponse.json({ message: "skills updated successfully", updatedskills }, { status: 200 });
    } catch (error) {
      console.error("Error during bulk update:", error);
      return NextResponse.json({ error: "Failed to update skills" }, { status: 500 });
    }
  }