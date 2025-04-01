import { NextRequest, NextResponse } from "next/server";
import { signInUser } from "@/backend/functions/user_master/POST/sign_user_in";

export async function POST(req: NextRequest) {
  try {
    console.log("**** Sign-in API called");

    const { email, password } = await req.json();
    
    if (!email || !password) {
      console.log("**** ERROR: Missing email or password");
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { user, token } = await signInUser(email, password);

    console.log("**** Sign-in successful:", user.email);
    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error("**** ERROR during sign-in:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
