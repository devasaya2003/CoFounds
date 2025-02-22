import { getJobsByPost } from "@/backend/functions/job_application/GET/get_by_post";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.type || !data.id || !data.page_no) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fetchedJobs = await getJobsByPost(data);
    return NextResponse.json({ fetchedJobs }, { status: 201 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
