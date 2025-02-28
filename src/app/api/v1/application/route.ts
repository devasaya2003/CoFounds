import { NextResponse } from "next/server";
import { createApplication } from "@/backend/functions/application_candidate_map/POST/create_application";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.user_id || !data.job_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdApplication = await createApplication(data);
    return NextResponse.json(
      { message: "Application created successfully", createdApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
