import { NextResponse } from "next/server";
import { createBulkRecruiters } from "@/backend/functions/company_recruiter_map/POST/bulk_create";
import { updateBulkRecruiter } from "@/backend/functions/company_recruiter_map/PUT/bulk_update";

export async function POST(req: Request) {
  try {
    const recruiters = await req.json();

    if (!Array.isArray(recruiters) || recruiters.length === 0) {
      return NextResponse.json(
        { error: "Recruiters must be a non-empty array" },
        { status: 400 }
      );
    }

    const createdRecruiters = await createBulkRecruiters(recruiters);

    return NextResponse.json(
      { message: "Recruiters created successfully", createdRecruiters },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk recruiters:", error);
    return NextResponse.json(
      { error: "Failed to create bulk recruiters" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const recruiters = await req.json();

    if (!Array.isArray(recruiters) || recruiters.length === 0) {
      return NextResponse.json(
        { error: "Recruiters must be a non-empty array" },
        { status: 400 }
      );
    }

    // Call the bulk update function
    const updatedRecruiters = await updateBulkRecruiter(recruiters);

    return NextResponse.json(
      { message: "Recruiters updated successfully", updatedRecruiters },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during bulk update:", error);
    return NextResponse.json(
      { error: "Failed to update recruiters" },
      { status: 500 }
    );
  }
}
