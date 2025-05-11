import { NextRequest, NextResponse } from "next/server";
import { createBulkUserExperience } from "@/backend/functions/user_experience/POST/create_bulk_experience";
import { updateUserExperiences } from "@/backend/functions/user_experience/PUT/update_experiences";

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

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();
    const { user_id } = payload;

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Handle case with no experiences to process
    if (
      payload.new_experiences.length === 0 && 
      payload.updated_experiences.length === 0 && 
      payload.deleted_experiences.length === 0
    ) {
      return NextResponse.json(
        { success: true, message: "No experiences to update", data: {
          updated: 0,
          created: 0,
          deleted: 0,
          total: 0
        }},
        { status: 200 }
      );
    }

    // Call the update function
    const result = await updateUserExperiences(payload);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experiences updated successfully",
      data: result.data
    });
  } catch (error) {
    console.error("Error updating user experiences:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update user experiences" 
      },
      { status: 500 }
    );
  }
}

