import { NextResponse } from "next/server";
import { bulkUpdateApplications, BulkUpdateApplicationPayload } from "@/backend/functions/application_candidate_map/PUT/bulk_update";

export async function PUT(req: Request) {
  try {
    const data: BulkUpdateApplicationPayload[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload format or empty array" },
        { status: 400 }
      );
    }

    for (const update of data) {
      if (!update.id || !update.updated_by || !update.status) {
        return NextResponse.json(
          { error: "Missing required fields in one or more update objects" },
          { status: 400 }
        );
      }
    }

    const updatedApplications = await bulkUpdateApplications(data);
    return NextResponse.json(
      { message: "Applications updated successfully", updatedApplications },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating applications:", error);
    return NextResponse.json(
      { error: "Failed to update applications" },
      { status: 500 }
    );
  }
}