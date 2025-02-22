import { NextResponse } from "next/server";
import { getAllJobApplications } from "@/backend/functions/job_application/GET/get_all";
import { createJob } from "@/backend/functions/job_application/POST/create_job";

export async function GET() {
  try {
    const jobs = await getAllJobApplications();
    return NextResponse.json(jobs, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (
      !data.company_id ||
      !data.recruiter_id ||
      !data.title ||
      !data.job_code ||
      !data.job_description ||
      !data.package ||
      !data.location
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdRecruiter = await createJob(data);
    return NextResponse.json(
      { message: "Job created successfully", createdRecruiter },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}