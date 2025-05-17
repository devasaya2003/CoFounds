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
  "/api/banner-image"
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
  
  // STEP 1: Check if this is a subdomain request
  let subdomain: string | null = null;
  
  if (isDevEnvironment && hostname.includes('localhost')) {
    const match = hostname.match(/^([^.]+)\.localhost(?::\d+)?$/);
    if (match && match[1] !== 'www') {
      subdomain = match[1];
      console.log("Local subdomain detected:", subdomain);
    }
  }
  else {
    const domainForComparison = mainDomain.replace(/^www\./, '');
    
    if (hostname !== domainForComparison &&
        hostname !== `www.${domainForComparison}` &&
        hostname.endsWith(`.${domainForComparison}`)) {
      
      subdomain = hostname.split(`.${domainForComparison}`)[0];
      console.log("Production subdomain detected:", subdomain);
    }
  }
  
  // STEP 2: If subdomain exists, handle subdomain flow (including any API requests for that subdomain)
  if (subdomain) {
    console.log(`Handling subdomain request for: ${subdomain}`);
    
    const mainDomainWithProtocol = process.env.NEXT_PUBLIC_BASE_URL || 
      (isDevEnvironment ? 'http://localhost:3000' : 'https://cofounds.in');
    
    const rewriteUrl = new URL(`/portfolio/${subdomain}${pathname === '/' ? '' : pathname}`, 
      mainDomainWithProtocol);
    
    console.log(`Rewriting ${hostname}${pathname} to ${rewriteUrl.toString()}`);
    
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-subdomain-rewrite', rewriteUrl.toString());
    return response;
  }
  
  // STEP 3: Handle regular domain flows (including API auth)
  
  // API route handling
  if (pathname.startsWith('/api/')) {
    // Check for API v1 routes that need authorization
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
      // For non-v1 API routes, bypass auth logic
      console.log("Non-v1 API request detected, bypassing auth logic:", pathname);
      return NextResponse.next();
    }
  }
  
  // The rest of your middleware logic for the main domain...
  // (Auth pages, public paths, protected paths, etc.)
}