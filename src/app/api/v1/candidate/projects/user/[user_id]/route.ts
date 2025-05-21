import { NextRequest, NextResponse } from "next/server";
import { getUserProjectsByUserID } from "@/backend/functions/user_projects/GET/get_by_user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const user_id = (await params).user_id;
  try {
    if (!user_id) {
      return NextResponse.json(
        { error: "user id is required" },
        { status: 400 }
      );
    }

    const projects = await getUserProjectsByUserID(user_id);

    if (!projects) {
      return NextResponse.json(
        {
          error: `Projects with user id ${user_id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects by user id:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects by user id" },
      { status: 500 }
    );
  }
}
