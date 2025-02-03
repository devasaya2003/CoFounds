import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    if (
      req.method === "GET" &&
      req.nextUrl.pathname.startsWith("/api/v1/resources")
    ) {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (
          req.method === "GET" &&
          req.nextUrl.pathname.startsWith("/api/v1/resources")
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/api/v1/resources/:path*",
    "/api/v1/companies/:path*",
    "/api/v1/degrees/:path*",
    "/api/v1/skills/:path*",
  ],
};
