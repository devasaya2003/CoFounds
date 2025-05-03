import { NextRequest, NextResponse } from "next/server";
import { createBulkUserEducation } from "@/backend/functions/user_education/POST/create_bulk_education";

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