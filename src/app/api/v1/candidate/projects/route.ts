import { NextRequest, NextResponse } from "next/server";
import { createBulkUserProjects } from "@/backend/functions/user_projects/POST/create_bulk_projects";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { user_id, projects } = data;

    // Check required fields
    if (!user_id || !projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields or invalid projects format" },
        { status: 400 }
      );
    }

    const result = await createBulkUserProjects(data);

    return NextResponse.json(
      {
        success: true,
        message: "User projects created successfully",
        count: result.count
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user projects:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create user projects" }, { status: 500 });
  }
}
