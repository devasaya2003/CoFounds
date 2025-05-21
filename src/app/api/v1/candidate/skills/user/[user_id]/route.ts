import { NextRequest, NextResponse } from "next/server";
import { getUserSkills } from "@/backend/functions/user_skillset/GET/get_user_skills";

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

    const skills = await getUserSkills(user_id);

    if (!skills) {
      return NextResponse.json(
        {
          error: `Skills with user id ${user_id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills by user id:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills by user id" },
      { status: 500 }
    );
  }
}
