import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client";
import { sign } from "jsonwebtoken";

export async function signInUser(email: string, password: string) {  
  const user = await prisma.userMaster.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {    
    throw new Error("Invalid email or password");
  }
  

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {    
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
  
  return { user, token };
}
