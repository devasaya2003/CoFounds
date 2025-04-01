import { NextRequest, NextResponse } from "next/server";
import { getUserDetails } from "@/backend/functions/user_master/GET/get_user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const experiences = await getUserDetails(id);

    if (!experiences) {
      return NextResponse.json(
        {
          error: `User with id ${id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch user by id" },
      { status: 500 }
    );
  }
}
