import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

interface UserJwtPayload extends JWTPayload {
  user?: {
    id: string;
    email: string;
    role: string;
    verified: boolean;
  };
  id?: string;
  email?: string;
  role?: string;
  sub?: string;
  verified?: boolean;
}

export async function GET(req: NextRequest) {
  // Get token from cookie
  const authToken = req.cookies.get("auth_token")?.value;
  
  if (!authToken) {
    return NextResponse.json({ 
      isAuthenticated: false 
    });
  }
  
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "");
    const { payload } = await jwtVerify(authToken, secret);
    const jwtPayload = payload as UserJwtPayload;
    const userId = jwtPayload.user?.id || jwtPayload.id || jwtPayload.sub || "";
    const userEmail = jwtPayload.user?.email || jwtPayload.email || "";
    const userRole = jwtPayload.user?.role || jwtPayload.role || "";
    const userVerified = jwtPayload.user?.verified ?? jwtPayload.verified ?? false;
    
    // Validate essential fields
    if (!userId || !userEmail) {
      return NextResponse.json({ 
        isAuthenticated: false,
        error: "Invalid user data in token"
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: userId,
        email: userEmail,
        role: userRole,
        verified: userVerified,
        isActive: true,
        userName: null,
        phone: null,
        description: null
      }
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ 
      isAuthenticated: false,
      error: "Invalid token"
    });
  }
}