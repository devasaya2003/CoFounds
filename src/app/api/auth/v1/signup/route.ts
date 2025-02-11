import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/backend/functions/user_master/POST/create_user";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // ✅ Manually create user (DO NOT use `signIn()` in an API route)
    const { user, token } = await createUser(email, password, role);

    // ✅ Return JWT token along with user info
    return NextResponse.json({ token, user }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
