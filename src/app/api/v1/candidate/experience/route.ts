import { NextRequest, NextResponse } from "next/server";
import { createBulkUserExperience } from "@/backend/functions/user_experience/POST/create_bulk_experience";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { user_id, experiences } = data;

    if (!user_id || !experiences || !Array.isArray(experiences) || experiences.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields or experiences array" },
        { status: 400 }
      );
    }

    if (experiences.length === 0) {
      return NextResponse.json(
        { success: false, message: "Atlease 1 experience required!" },
        { status: 400 }
      );
    }

    const createdExperiences = await createBulkUserExperience(data);
    
    return NextResponse.json(
      { 
        success: true,
        message: "User experiences created successfully", 
        count: createdExperiences.count
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user experiences:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create user experiences" 
      },
      { status: 500 }
    );
  }
}
