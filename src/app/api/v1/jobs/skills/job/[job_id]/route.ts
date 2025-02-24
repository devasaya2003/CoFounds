import { NextRequest, NextResponse } from "next/server";
import { getAllJobSkillsByJobID } from "@/backend/functions/application_skill_map/GET/get_by_job";
import { updateJobSkills } from "@/backend/functions/application_skill_map/PUT/update_job_skills";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const job_id = (await params).job_id;

  try {
    const result = await getAllJobSkillsByJobID(job_id);
    if (!result || !result) {
      return NextResponse.json(
        { error: `No skills found for job id ${job_id}` },
        { status: 404 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching skills by job id:", err);
    return NextResponse.json(
      { error: "Failed to fetch skills by job id" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const job_id = (await params).job_id;

  try {
    const payload = await req.json();
    if (
      !payload ||
      !payload.actions ||
      !Array.isArray(payload.actions) ||
      payload.actions.length === 0
    ) {
      return NextResponse.json(
        { error: "No actions provided for update" },
        { status: 400 }
      );
    }

    const result = await updateJobSkills(job_id, payload);

    return NextResponse.json(
      { message: "Job skills updated successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job skills:", error);
    return NextResponse.json(
      { error: "Failed to update job skills" },
      { status: 500 }
    );
  }
}
