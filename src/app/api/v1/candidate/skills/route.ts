import { NextRequest, NextResponse } from "next/server";
import { createBulkUserSkillset } from "@/backend/functions/user_skillset/POST/create_bulk_skillset";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
      return NextResponse.json(
        { error: "At least one skill is required" },
        { status: 400 }
      );
    }

    const result = await createBulkUserSkillset(data);

    return NextResponse.json({
      success: true,
      message: "Skills added successfully",
      count: result.count,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating user skillsets:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create user skillsets",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}