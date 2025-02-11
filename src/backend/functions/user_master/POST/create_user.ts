import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client";
import { sign } from "jsonwebtoken";
import { UserRole } from "@prisma/client";

export async function createUser(email: string, password: string, role: string) {
  if (!Object.values(UserRole).includes(role as UserRole)) {
    throw new Error(`Invalid role. Must be one of: ${Object.values(UserRole).join(", ")}`);
  }
  const existingUser = await prisma.userMaster.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await prisma.userMaster.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role: role as UserRole,
      verified: false,
    },
  });
  const token = sign(
    {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified,
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: "30d" }
  );
  return { user: newUser, token };
}