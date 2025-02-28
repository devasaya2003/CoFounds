import { updateApplication } from "@/backend/functions/application_candidate_map/PUT/update_application";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }
    const data = await req.json();
    if (!data.updated_by || !data.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedApplication = await updateApplication(
      id,
      data.updated_by,
      data.status
    );
    return NextResponse.json(
      { message: "Application updated successfully", updatedApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
