import { NextRequest, NextResponse } from "next/server";
import { getAllQuestionsByJobIdPaginated } from "@/backend/functions/extra_questions/GET/get_by_job_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string; page_no: string }> }
) {
  const job_id = (await params).job_id;
  const page_no = (await params).page_no;

  try {
    const page = parseInt(page_no, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    const result = await getAllQuestionsByJobIdPaginated(job_id, page);
    if (!result || !result) {
      return NextResponse.json(
        { error: `No questions found for job id ${job_id}` },
        { status: 404 }
      );
    }

    if (!result || !result.questions.length) {
      return NextResponse.json(
        { error: `No questions found for page ${page}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching questions by job id:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions by job id" },
      { status: 500 }
    );
  }
}
