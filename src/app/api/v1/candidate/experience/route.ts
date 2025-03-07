import { NextRequest, NextResponse } from "next/server";
import { createUserExperience } from "@/backend/functions/user_experience/POST/create_experience";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.user_id || !data.end_at || !data.company_name || !data.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdExperience = await createUserExperience(data);
    return NextResponse.json(
      { message: "User experience created successfully", createdExperience },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user experience:", error);
    return NextResponse.json(
      { error: "Failed to create user experience" },
      { status: 500 }
    );
  }
}
