import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client"; // Adjust path if needed
import { sign } from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  adapter: PrismaAdapter(prisma), // Prisma as NextAuth database
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // ✅ Extract user details from Google response
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: "candidate", // Default role for Google signups
          verified: true, // Assume Google users are verified
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        console.log("**** Credentials login triggered");

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        const user = await prisma.userMaster.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: user.verified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("**** User signing in:", user.email);

      if (account?.provider === "google") {
        console.log("**** Google sign-in detected");

        let existingUser = await prisma.userMaster.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          console.log("**** Creating new user from Google account");

          existingUser = await prisma.userMaster.create({
            data: {
              email: user.email!,
              role: "candidate", // Default role for Google signups
              verified: true, // Assume Google users are verified
            },
          });
        }

        return true; // ✅ Allow login
      }

      return true;
    },
    async jwt({ token, user }) {
      console.log("**** JWT callback triggered");

      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: user.verified,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("**** Session callback triggered");

      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          role: token.user.role,
          verified: token.user.verified,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
