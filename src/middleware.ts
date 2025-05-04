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
  "/portfolio/",
  "/api/portfolio/",
];

interface TokenPayload extends JWTPayload {
  role?: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  const mainDomain = process.env.NEXT_PUBLIC_BASE_URL || 'cofounds.in';
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  
  
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
      url.pathname = `/portfolio/${username}`;
      
      console.log(`Rewriting ${hostname}${pathname} to ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  }
  
  console.log("Middleware executing for:", pathname);
  
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    console.log("Auth page detected, checking if already logged in");
        
    const authToken = req.cookies.get("auth_token")?.value;
    
    if (authToken) {
      try {        
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const { payload } = await jwtVerify(authToken, secret);
        const typedPayload = payload as TokenPayload;
        const userRole = typedPayload.role;
        
        console.log("User already logged in, redirecting based on role:", userRole);
                
        if (userRole === "recruiter") {
          return NextResponse.redirect(new URL("/recruiter/app", req.url));
        } else if (userRole === "candidate") {
          return NextResponse.redirect(new URL("/candidate/app", req.url));
        }
      } catch (error) {
        console.log("Invalid token, allowing access to auth page");        
      }
    }
        
    console.log("No valid token, allowing access to auth page");
    return NextResponse.next();
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