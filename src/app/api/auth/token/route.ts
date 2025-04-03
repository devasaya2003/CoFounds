import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }
        
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    if (!token) {
      return NextResponse.json(
        { error: "Failed to retrieve token" },
        { status: 500 }
      );
    }
        
    return NextResponse.json({ token: token.raw || token });
    
  } catch (error) {
    console.error("Error retrieving token:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving the token" },
      { status: 500 }
    );
  }
}