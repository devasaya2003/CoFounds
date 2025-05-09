import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

export const config = {
  matcher: [    
    '/api/v1/:path*',
    '/candidate/:path*',
    '/recruiter/:path*',
    '/auth',
    '/auth/:path*',            
    '/((?!_next/|static/|favicon.ico).*)',
  ],
};

const PUBLIC_PATHS = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/recruiter-sign-in",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/portfolio",
  "/portfolio/",
  "/api/portfolio/",
  "/api/banner-image"
];

const PUBLIC_PATH_PREFIXES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/recruiter-sign-in",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/portfolio/",
  "/portfolio",
  "/api/portfolio/",
  "/api/banner-image"
];

interface TokenPayload extends JWTPayload {
  role?: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  const mainDomain = process.env.NEXT_PUBLIC_BASE_URL || 'cofounds.in';
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  
  console.log("Middleware executing for:", pathname);

  if (pathname.startsWith("/api/portfolio/")) {
    console.log("Portfolio API request, allowing access");
    return NextResponse.next();
  }
  
  if (isDevEnvironment && hostname.includes('localhost')) {
        
        
    const subdomainMatch = hostname.match(/^([^.]+)\.localhost/);
    
    if (subdomainMatch && subdomainMatch[1] !== 'www') {
      console.log("Local subdomain detected:", subdomainMatch[1]);
      
      const url = req.nextUrl.clone();
      url.pathname = `/portfolio/${subdomainMatch[1]}`;
      
      console.log(`Rewriting ${hostname}${pathname} to ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  }
    
  else {
    const isSubdomain = !hostname.startsWith('www.') &&
                        hostname !== mainDomain &&
                        hostname.endsWith(`.${mainDomain}`);
                        
    if (isSubdomain) {
      console.log("Production subdomain detected:", hostname);
      
      const username = hostname.split('.')[0];
      
      const url = req.nextUrl.clone();
      // Preserve the path after the username
      url.pathname = `/portfolio/${username}${pathname === '/' ? '' : pathname}`;
      
      console.log(`Rewriting ${hostname}${pathname} to ${url.pathname}`);
      
      // Add debugging header
      const response = NextResponse.rewrite(url);
      response.headers.set('x-subdomain-rewrite', url.pathname);
      return response;
    }
  }
  
  if (PUBLIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    console.log("Public path detected, allowing access without auth check");
    return NextResponse.next(); // Immediately return next() without further checks
  }
    
  if (pathname === "/auth") {
    console.log("Auth root path, redirecting to sign-in");
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
    
  if (pathname.startsWith("/api/v1/")) {
    console.log("Checking API authorization for:", pathname);
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("API unauthorized: Missing or invalid auth header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      const token = authHeader.split(" ")[1];
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      await jwtVerify(token, secret);
      console.log("API authorized successfully");
      return NextResponse.next();
    } catch (error) {
      console.log("API unauthorized: Token verification failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
    
  if (pathname.startsWith("/candidate/") || pathname.startsWith("/recruiter/")) {
    console.log("Protected page access:", pathname);
    const authToken = req.cookies.get("auth_token")?.value;
    
    if (!authToken) {
      console.log("No auth token in cookie, redirecting to login");      
      const loginPath = pathname.startsWith("/recruiter/") 
        ? "/auth/recruiter-sign-in" 
        : "/auth/sign-in";
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      const { payload } = await jwtVerify(authToken, secret);
      const typedPayload = payload as TokenPayload;
      const userRole = typedPayload.role;
      
      console.log("User role:", userRole, "trying to access:", pathname);
            
      if (pathname.startsWith("/recruiter/") && userRole !== "recruiter") {
        console.log("Non-recruiter trying to access recruiter area, redirecting");
        return NextResponse.redirect(
          new URL(userRole === "candidate" ? "/candidate/app" : "/auth/recruiter-sign-in", req.url)
        );
      }
      
      if (pathname.startsWith("/candidate/") && userRole !== "candidate") {
        console.log("Non-candidate trying to access candidate area, redirecting");
        return NextResponse.redirect(
          new URL(userRole === "recruiter" ? "/recruiter/app" : "/auth/sign-in", req.url)
        );
      }
      
      console.log("Access granted to protected page");
      return NextResponse.next();
    } catch (error) {
      console.log("Invalid token in cookie, redirecting to login");
      const loginPath = pathname.startsWith("/recruiter/") 
        ? "/auth/recruiter-sign-in" 
        : "/auth/sign-in";
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  }
    
  console.log("Permitting access to non-protected path:", pathname);
  return NextResponse.next();
}