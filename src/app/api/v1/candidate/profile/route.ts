import { NextRequest, NextResponse } from "next/server";
import { createUserProfile } from "@/backend/functions/user_master/POST/create_profile";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (data.user_name !== undefined && typeof data.user_name !== 'string') {
      return NextResponse.json(
        { error: "Username must be a string" },
        { status: 400 }
      );
    }

    if (data.first_name !== undefined && typeof data.first_name !== 'string') {
      return NextResponse.json(
        { error: "First name must be a string" },
        { status: 400 }
      );
    }


    const updatedProfile = await createUserProfile(data);


    let message = "Profile updated successfully";
    if (data.user_name && !data.first_name && !data.last_name) {
      message = "Username updated successfully";
    } else if (data.user_name && data.first_name && data.last_name) {
      message = "Full profile created successfully";
    }

    return NextResponse.json(
      {
        success: true,
        message,
        updatedProfile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user profile",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}