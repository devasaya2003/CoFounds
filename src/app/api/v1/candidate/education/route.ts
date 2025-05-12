import { NextRequest, NextResponse } from "next/server";
import { createBulkUserEducation } from "@/backend/functions/user_education/POST/create_bulk_education";
import { updateUserEducation } from "@/backend/functions/user_education/PUT/update_education";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Inside the route...!");
    console.log("BODY: ", data);

    if (!data.user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!data.education || !Array.isArray(data.education) || data.education.length === 0) {
      return NextResponse.json(
        { error: "At least one education record is required" },
        { status: 400 }
      );
    }

    for (const edu of data.education) {
      if (!edu.degree_id || !edu.edu_from || !edu.started_at) {
        return NextResponse.json(
          { error: "Each education record must include degree_id, edu_from, and started_at" },
          { status: 400 }
        );
      }
    }

    const result = await createBulkUserEducation(data);

    return NextResponse.json({
      success: true,
      message: "Education records added successfully",
      count: result.count,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating education records:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create education records",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log("== EDUCATION UPDATE - REQUEST BODY ==");
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
      (!data.new_education || data.new_education.length === 0) &&
      (!data.updated_education || data.updated_education.length === 0) &&
      (!data.deleted_education || data.deleted_education.length === 0)
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No changes provided. At least one operation (create, update, or delete) must be included" 
        },
        { status: 400 }
      );
    }

    // Validate new education entries
    if (data.new_education && data.new_education.length > 0) {
      for (const edu of data.new_education) {
        if (!edu.degree_id || !edu.institution) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Each new education record must include degree_id and institution" 
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate updated education entries
    if (data.updated_education && data.updated_education.length > 0) {
      for (const edu of data.updated_education) {
        if (!edu.id || !edu.degree_id || !edu.institution) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Each updated education record must include id, degree_id, and institution" 
            },
            { status: 400 }
          );
        }
      }
    }

    // Update the education records
    const result = await updateUserEducation(data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to update education records", 
          details: result.error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Education records updated successfully",
      data: result.data
    });

  } catch (error) {
    console.error("Error updating education records:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update education records",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}