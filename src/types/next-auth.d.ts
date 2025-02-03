import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: string;
      verified: boolean;
      accessToken?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    role: string;
    verified: boolean;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      role: string;
      verified: boolean;
    };
    accessToken?: string;
  }
}