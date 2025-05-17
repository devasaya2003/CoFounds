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

function isPublicPath(path: string): boolean {
  return PUBLIC_PATH_PREFIXES.some(prefix => path.startsWith(prefix));
}

function isAuthPage(path: string): boolean {
  return AUTH_PAGES.includes(path);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  // Environment-agnostic config
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const rawDomain = process.env.NEXT_PUBLIC_DOMAIN || (isDevEnvironment ? 'localhost' : 'cofounds.in');
  const mainDomain = extractDomain(rawDomain);
  const cleanDomain = mainDomain.replace(/^www\./, '');
  
  console.log("Middleware executing for:", pathname, "on host:", hostname);
  console.log("Domain comparison data:", { hostname, mainDomain, cleanDomain });
  
  // STEP 1: Check if this is a subdomain request with environment-agnostic logic
  let subdomain: string | null = null;
  
  // First, strip port if present (works for both localhost and production)
  const hostWithoutPort = hostname.split(':')[0];
  
  // Both dev and prod subdomain detection in a unified approach
  if (hostWithoutPort !== cleanDomain && hostWithoutPort !== `www.${cleanDomain}`) {
    if (isDevEnvironment && hostWithoutPort.includes('localhost')) {
      // Local environment subdomain parsing
      const match = hostWithoutPort.match(/^([^.]+)\.localhost$/);
      if (match && match[1] !== 'www') {
        subdomain = match[1];
      }
    } else if (hostWithoutPort.endsWith(`.${cleanDomain}`)) {
      // Production environment subdomain parsing
      subdomain = hostWithoutPort.replace(`.${cleanDomain}`, '');
    }
  }
  
  if (subdomain) {
    console.log(`Handling subdomain request for: ${subdomain}`);
    
    const mainDomainWithProtocol = process.env.NEXT_PUBLIC_BASE_URL || 
      (isDevEnvironment ? 'http://localhost:3000' : `https://${cleanDomain}`);
    
    const rewriteUrl = new URL(`/portfolio/${subdomain}${pathname === '/' ? '' : pathname}`, 
      mainDomainWithProtocol);
    
    console.log(`Rewriting ${hostname}${pathname} to ${rewriteUrl.toString()}`);
    
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-subdomain-rewrite', rewriteUrl.toString());
    return response;
  }
  
  // STEP 2: Handle API routes first (protect v1 routes)
  if (pathname.startsWith('/api/')) {
    // If it's a public API path, bypass auth checks
    if (isPublicPath(pathname)) {
      console.log("Public API path detected, bypassing auth:", pathname);
      return NextResponse.next();
    }
    
    // Protect API v1 routes
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
    
    // Non-v1 API routes bypass auth
    console.log("Non-v1 API request detected, bypassing auth logic:", pathname);
    return NextResponse.next();
  }
  
  // STEP 3: Handle main application paths
  
  // Allow public paths
  if (isPublicPath(pathname)) {
    console.log("Public path detected, bypassing auth:", pathname);
    return NextResponse.next();
  }
  
  // Check if user is on auth page while logged in
  if (isAuthPage(pathname)) {
    const session = req.cookies.get('next-auth.session-token') || 
                   req.cookies.get('__Secure-next-auth.session-token');
    
    if (session) {
      console.log("User already logged in, redirecting from auth page");
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  }
  
  // Check if the user is logged in for protected routes
  const session = req.cookies.get('next-auth.session-token') || 
                 req.cookies.get('__Secure-next-auth.session-token');
  
  if (!session) {
    console.log("User not logged in, redirecting to signin");
    
    // Create a redirect URL with the callback
    const redirectUrl = new URL('/auth/sign-in', req.url);
    redirectUrl.searchParams.set('callbackUrl', encodeURI(req.url));
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // User is logged in for protected route
  console.log("User authorized for protected route");
  return NextResponse.next();
}