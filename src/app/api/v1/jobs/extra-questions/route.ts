import { createQuestions } from "@/backend/functions/extra_questions/POST/create_questions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (
      !data.job_id ||
      !data.questions ||
      !Array.isArray(data.questions) ||
      !data.created_by
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdJobSkills = await createQuestions(data);

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
