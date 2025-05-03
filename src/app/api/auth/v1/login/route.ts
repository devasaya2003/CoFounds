import { NextRequest, NextResponse } from "next/server";
import { signInUser } from "@/backend/functions/user_master/POST/sign_user_in";

export async function POST(req: NextRequest) {
  try {
    console.log("**** Sign-in API called");

    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { user, token } = await signInUser(email, password);
    console.log("**** Sign-in successful:", user.email);
    
    
    const response = NextResponse.json({
      user,
      token,
      success: true
    });
    
    
    response.cookies.set({
      name: "auth_token",
      value: token,
      path: "/",
      maxAge: 60 * 60 * 24, 
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
    
    return response;
  } catch (error) {
    console.error("**** Sign-in error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
