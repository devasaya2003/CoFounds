import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

interface UserJwtPayload extends JWTPayload {
  user?: {
    id: string;
    email: string;
    role: string;
    verified: boolean;
    userName?: string | null;
    phone?: string | null;
    description?: string | null;
  };
  id?: string;
  email?: string;
  role?: string;
  sub?: string;
  verified?: boolean;
  userName?: string | null;
  phone?: string | null;
  description?: string | null;
}

export async function GET(req: NextRequest) {
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
    
    // Extract just the essential fields
    const userId = jwtPayload.user?.id || jwtPayload.id || jwtPayload.sub || "";
    const userEmail = jwtPayload.user?.email || jwtPayload.email || "";
    const userRole = jwtPayload.user?.role || jwtPayload.role || "";
    const userVerified = jwtPayload.user?.verified ?? jwtPayload.verified ?? false;
    const userName = jwtPayload.user?.userName || jwtPayload.userName || null;

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
        userName: userName,
        phone: null
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