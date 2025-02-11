import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client";
import { sign } from "jsonwebtoken";

export async function signInUser(email: string, password: string) {
  console.log(`**** Signing in user: ${email}`);
  const user = await prisma.userMaster.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    console.log("**** ERROR: No user found or password missing");
    throw new Error("Invalid email or password");
  }

  console.log("User: ", user);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    console.log("**** ERROR: Invalid password");
    throw new Error("Invalid email or password");
  }

  const token = sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      verified: user.verified,
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: "30d" }
  );

  console.log("**** User signed in successfully");
  return { user, token };
}
