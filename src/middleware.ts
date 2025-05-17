import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/candidate/:path*',
    '/recruiter/:path*',
    '/auth',
    '/auth/:path*',
    '/((?!_next/|static/|favicon.ico|api/).*)',
  ],
};

const PUBLIC_PATH_PREFIXES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/recruiter-sign-in",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/portfolio/",
  "/portfolio",
  "/api/portfolio/",
];

const AUTH_PAGES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/recruiter-sign-in"
];

interface TokenPayload extends JWTPayload {
  role?: string;
}

function extractDomain(url: string): string {
  try {
    if (url.includes('://')) {
      return new URL(url).hostname;
    }
    if (url.includes(':')) {
      return url.split(':')[0];
    }
    return url;
  } catch (e) {
    console.error("Error parsing domain:", e);
    return url;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const rawDomain = process.env.NEXT_PUBLIC_DOMAIN || (isDevEnvironment ? 'localhost' : 'cofounds.in');
  const mainDomain = extractDomain(rawDomain);
  
  console.log("Middleware executing for:", pathname, "on host:", hostname);
  console.log("Domain info:", { rawDomain, mainDomain, isDevEnvironment });
  
  // STEP 1: Check for subdomains FIRST - this must come before ANY other checks
  let subdomain: string | null = null;
  
  if (isDevEnvironment && hostname.includes('localhost')) {
    const match = hostname.match(/^([^.]+)\.localhost(?::\d+)?$/);
    if (match && match[1] !== 'www') {
      subdomain = match[1];
      console.log("Local subdomain detected:", subdomain);
    }
  } else {
    const domainForComparison = mainDomain.replace(/^www\./, '');
    
    if (hostname !== domainForComparison &&
        hostname !== `www.${domainForComparison}` &&
        hostname.endsWith(`.${domainForComparison}`)) {
      
      subdomain = hostname.split(`.${domainForComparison}`)[0];
      console.log("Production subdomain detected:", subdomain);
    }
  }
  
  // Handle subdomain requests immediately, regardless of path
  if (subdomain) {
    console.log(`Subdomain request detected for: ${subdomain}`);
    
    const mainDomainWithProtocol = process.env.NEXT_PUBLIC_BASE_URL || 
      (isDevEnvironment ? 'http://localhost:3000' : `https://${mainDomain.replace(/^www\./, '')}`);
    
    const rewriteUrl = new URL(`/portfolio/${subdomain}${pathname === '/' ? '' : pathname}`, 
      mainDomainWithProtocol);
    
    console.log(`Rewriting ${hostname}${pathname} to ${rewriteUrl.toString()}`);
    
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-subdomain-rewrite', rewriteUrl.toString());
    return response;
  }
  
  // STEP 2: Only now handle API routes after subdomain check
  if (pathname.startsWith('/api/')) {
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
    } else {
      return NextResponse.next();
    }
  }
  
  // STEP 3: Rest of your middleware for non-subdomain requests
  // Check if user is already logged in and trying to access auth pages
  if (AUTH_PAGES.some(path => pathname.startsWith(path))) {
    console.log("Auth page access detected, checking if already logged in");
    const authToken = req.cookies.get("auth_token")?.value;

    if (authToken) {
      try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const { payload } = await jwtVerify(authToken, secret);
        const typedPayload = payload as TokenPayload;
        const userRole = typedPayload.role;

        console.log("Logged in user trying to access auth page, redirecting to dashboard");
        
        // Redirect to appropriate dashboard based on role
        if (userRole === "candidate") {
          return NextResponse.redirect(new URL("/candidate/app", req.url));
        } else if (userRole === "recruiter") {
          return NextResponse.redirect(new URL("/recruiter/app", req.url));
        }
      } catch (error) {
        console.log("Invalid token, allowing access to auth page");
        // Token is invalid, allow access to auth pages
      }
    }
  }

  if (PUBLIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    console.log("Public path detected, allowing access without auth check");
    return NextResponse.next();
  }

  if (pathname === "/auth") {
    console.log("Auth root path, redirecting to sign-in");
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
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