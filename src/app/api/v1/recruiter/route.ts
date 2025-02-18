import { NextResponse } from "next/server";
import { getAllRecruiters } from "@/backend/functions/company_recruiter_map/GET/get_all";
import { createRecruiter } from "@/backend/functions/company_recruiter_map/POST/create_recruiter";

export async function GET() {
  try {
    const recruiters = await getAllRecruiters();
    return NextResponse.json(recruiters, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recruiters" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.user_id || !data.company_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdRecruiter = await createRecruiter(data);
    return NextResponse.json(
      { message: "Recruiter created successfully", createdRecruiter },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recruiter:", error);
    return NextResponse.json(
      { error: "Failed to create recruiter" },
      { status: 500 }
    );
  }
}
