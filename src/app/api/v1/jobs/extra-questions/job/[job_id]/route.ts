import { NextRequest, NextResponse } from "next/server";
import { getAllQuestionsByJobId } from "@/backend/functions/extra_questions/GET/get_by_job";
import { updateQuestions } from "@/backend/functions/extra_questions/PUT/update_questions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const job_id = (await params).job_id;

  try {
    const result = await getAllQuestionsByJobId(job_id);
    if (!result || !result) {
      return NextResponse.json(
        { error: `No questions found for job id ${job_id}` },
        { status: 404 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching questions by job id:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions by job id" },
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
      !payload.updatedBy ||
      !payload.actions ||
      !Array.isArray(payload.actions) ||
      payload.actions.length === 0
    ) {
      return NextResponse.json(
        { error: "No actions provided for update" },
        { status: 400 }
      );
    }

    const result = await updateQuestions(job_id, payload);

    return NextResponse.json(
      { message: "Job questions updated successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job questions:", error);
    return NextResponse.json(
      { error: "Failed to update job questions" },
      { status: 500 }
    );
  }
}
