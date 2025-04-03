import { jwtVerify, JWTPayload } from "jose";

// Define a more specific interface for JWT payload
interface UserJwtPayload extends JWTPayload {
  user?: {
    id?: string;
    email?: string;
    role?: string;
    verified?: boolean;
    isActive?: boolean;
    userName?: string | null;
    phone?: string | null;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  verified?: boolean;
  isActive?: boolean;
  userName?: string | null;
}

// Update AuthUser to match UserProfile in your auth slice
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  userName?: string | null;
  phone?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    
    // Cast to our expected type
    const jwtPayload = payload as UserJwtPayload;
    
    // Handle different token formats and ensure required fields
    const userData = jwtPayload.user || jwtPayload;
    
    // Check for required fields
    const userId = userData.id;
    const userEmail = userData.email;
    
    if (!userId || !userEmail) {
      console.error("Missing required user data in token");
      return null;
    }
    
    // Helper function to safely convert unknown to string or null
    function safeString(value: unknown): string | null {
      return typeof value === 'string' ? value : null;
    }
    
    // Ensure we have mandatory fields with good defaults
    return {
      id: userId,
      email: userEmail,
      role: typeof userData.role === 'string' ? userData.role : "user",
      verified: userData.verified === true,
      isActive: userData.isActive !== false,
      userName: safeString(userData.userName),
      phone: safeString(userData.phone),
      description: safeString(userData.description),
      createdAt: typeof userData.createdAt === 'string' ? userData.createdAt : undefined,
      updatedAt: typeof userData.updatedAt === 'string' ? userData.updatedAt : undefined
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export async function getUserFromApiStatus(): Promise<{isAuthenticated: boolean, user: AuthUser | null}> {
  try {
    const response = await fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include', // Include cookies in request
    });
    
    if (!response.ok) {
      return { isAuthenticated: false, user: null };
    }
    
    const data = await response.json();
    
    if (!data.isAuthenticated || !data.user) {
      return { isAuthenticated: false, user: null };
    }
    
    const userData = data.user;
    
    // Check for required fields
    if (!userData.id || !userData.email) {
      console.error("Missing required user data in API response");
      return { isAuthenticated: false, user: null };
    }
    
    // Helper function to safely convert unknown to string or null
    function safeString(value: unknown): string | null {
      return typeof value === 'string' ? value : null;
    }
    
    // Ensure user data matches expected interface
    const user: AuthUser = {
      id: userData.id,
      email: userData.email,
      role: typeof userData.role === 'string' ? userData.role : "user",
      verified: userData.verified === true,
      isActive: userData.isActive !== false,
      userName: safeString(userData.userName),
      phone: safeString(userData.phone),
      description: safeString(userData.description),
      createdAt: typeof userData.createdAt === 'string' ? userData.createdAt : undefined,
      updatedAt: typeof userData.updatedAt === 'string' ? userData.updatedAt : undefined
    };
    
    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Failed to check auth status:", error);
    return { isAuthenticated: false, user: null };
  }
}

export function getAuthTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get token from cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}