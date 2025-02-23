import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/api/v1/companies/:path*",
    "/api/v1/degrees/:path*",
    "/api/v1/skills/:path*",
    "/api/v1/recruiter/:path*",
    "/api/v1/jobs/:path*"
  ],
};

export async function middleware(req: NextRequest) {
  if (
    req.method === "GET" &&
    req.nextUrl.pathname.startsWith("/api/v1/resources")
  ) {
    return NextResponse.next();
  }
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
