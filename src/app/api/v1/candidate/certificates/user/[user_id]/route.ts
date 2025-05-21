import { NextRequest, NextResponse } from "next/server";
import { getUserCertificatesByUserID } from "@/backend/functions/user_certificates/GET/get_by_user";

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

    const certificates = await getUserCertificatesByUserID(user_id);

    if (!certificates) {
      return NextResponse.json(
        {
          error: `Certificates with user id ${user_id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates by user id:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates by user id" },
      { status: 500 }
    );
  }
}
