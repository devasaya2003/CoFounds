import { NextRequest, NextResponse } from "next/server";
import { createUserProfile } from "@/backend/functions/user_master/POST/create_profile";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.user_id || !data.user_name || !data.first_name || !data.last_name || !data.phone || !data.dob || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdProfile = await createUserProfile(data);
    return NextResponse.json(
      { message: "User profile created successfully", createdProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }
}
