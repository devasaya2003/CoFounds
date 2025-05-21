import { NextRequest, NextResponse } from "next/server";
import { getUserLinksByUserID } from "@/backend/functions/user_links/GET/get_by_user";

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

    const links = await getUserLinksByUserID(user_id);

    if (!links) {
      return NextResponse.json(
        {
          error: `links with user id ${user_id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("Error fetching links by user id:", error);
    return NextResponse.json(
      { error: "Failed to fetch links by user id" },
      { status: 500 }
    );
  }
}
