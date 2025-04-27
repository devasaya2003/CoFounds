import { NextRequest, NextResponse } from "next/server";
import { getUserExperienceByUserID } from "@/backend/functions/user_experience/GET/get_by_user";

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

    const experiences = await getUserExperienceByUserID(user_id);

    if (!experiences) {
      return NextResponse.json(
        {
          error: `Experience with user id ${user_id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error("Error fetching experiences by user id:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences by user id" },
      { status: 500 }
    );
  }
}
