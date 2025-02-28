import { NextRequest, NextResponse } from "next/server";
import { getApplicationByJobId } from "@/backend/functions/application_candidate_map/GET/get_by_job";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const job_id = (await params).job_id;
  try {
    if (!job_id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const applications = await getApplicationByJobId(job_id);

    if (!applications) {
      return NextResponse.json(
        { error: `Applications with ID ${job_id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications by Job ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications by Job ID" },
      { status: 500 }
    );
  }
}
