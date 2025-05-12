import { NextRequest, NextResponse } from "next/server";
import { createBulkUserProjects } from "@/backend/functions/user_projects/POST/create_bulk_projects";
import { updateUserProjects } from "@/backend/functions/user_projects/PUT/update_projects";

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

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log("== PROJECTS UPDATE - REQUEST BODY ==");
    console.log(JSON.stringify(data, null, 2));
    
    // Basic validation
    if (!data.user_id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate that at least one operation is being performed
    if (
      (!data.new_projects || data.new_projects.length === 0) &&
      (!data.updated_projects || data.updated_projects.length === 0) &&
      (!data.deleted_projects || data.deleted_projects.length === 0)
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No changes provided. At least one operation (create, update, or delete) must be included" 
        },
        { status: 400 }
      );
    }

    // Validate new projects
    if (data.new_projects && data.new_projects.length > 0) {
      for (const proj of data.new_projects) {
        if (!proj.title) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Each new project must include a title" 
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate updated projects
    if (data.updated_projects && data.updated_projects.length > 0) {
      for (const proj of data.updated_projects) {
        if (!proj.id || !proj.title) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Each updated project must include id and title" 
            },
            { status: 400 }
          );
        }
      }
    }

    // Update the project records
    const result = await updateUserProjects(data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to update project records", 
          details: result.error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project records updated successfully",
      data: result.data
    });

  } catch (error) {
    console.error("Error updating project records:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project records",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
