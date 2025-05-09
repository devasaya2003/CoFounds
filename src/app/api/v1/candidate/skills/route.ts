import { NextRequest, NextResponse } from "next/server";
import { createBulkUserSkillset } from "@/backend/functions/user_skillset/POST/create_bulk_skillset";
import { updateUserSkills } from "@/backend/functions/user_skillset/PUT/update_by_user";

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

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    console.log("DATA: ", data);


    if (!data.user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }


    const hasUpdatedSkills = Array.isArray(data.updated_skillset) && data.updated_skillset.length > 0;
    const hasNewSkills = Array.isArray(data.new_skillset) && data.new_skillset.length > 0;
    const hasDeletedSkills = Array.isArray(data.deleted_skillset) && data.deleted_skillset.length > 0;

    if (!hasUpdatedSkills && !hasNewSkills && !hasDeletedSkills) {
      return NextResponse.json(
        { error: "At least one skill update, addition, or deletion is required" },
        { status: 400 }
      );
    }


    const payload = {
      user_id: data.user_id,
      updated_skillset: Array.isArray(data.updated_skillset) ? data.updated_skillset : [],
      new_skillset: Array.isArray(data.new_skillset) ? data.new_skillset : [],
      deleted_skillset: Array.isArray(data.deleted_skillset) ? data.deleted_skillset : []
    };

    const result = await updateUserSkills(payload);


    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || "Failed to update skills",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Skills updated successfully",
      data: result.data,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating user skills:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to update user skills",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}