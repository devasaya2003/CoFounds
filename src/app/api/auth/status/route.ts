import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  // Get token from cookie
  const authToken = req.cookies.get("auth_token")?.value;
  
  if (!authToken) {
    return NextResponse.json({ 
      isAuthenticated: false 
    });
  }
  
  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(authToken, secret);
    
    return NextResponse.json({
      isAuthenticated: true,
      user: payload.user,
      role: payload.role
    });
  } catch (error) {
    return NextResponse.json({ 
      isAuthenticated: false,
      error: "Invalid token"
    });
  }
}