import { getByJobRecruiterId } from "@/backend/functions/job_application/GET/get_by_job_recruiter_id";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.job_id || !data.recruiter_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fetchedJob = await getByJobRecruiterId(data);
    return NextResponse.json({ fetchedJob }, { status: 201 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
