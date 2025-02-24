import { createJobSkills } from "@/backend/functions/application_skill_map/POST/create_job_skills";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (
      !data.job_id ||
      !data.skills ||
      !Array.isArray(data.skills) ||
      !data.created_by
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdJobSkills = await createJobSkills(
      data.job_id,
      data.skills,
      data.is_active,
      data.created_by
    );

    return NextResponse.json(
      { message: "Job skills created successfully", createdJobSkills },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job skills:", error);
    return NextResponse.json(
      { error: "Failed to create job skills" },
      { status: 500 }
    );
  }
}
