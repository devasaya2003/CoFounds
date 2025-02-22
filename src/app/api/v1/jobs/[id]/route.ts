import { NextRequest, NextResponse } from "next/server";
import { updateJob } from "@/backend/functions/job_application/PUT/update_job";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const updatedDegree = await updateJob(id, data);

    return NextResponse.json(
      { message: "Job updated successfully", updatedDegree },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during job update:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
