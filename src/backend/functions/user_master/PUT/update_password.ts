import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client";

export const updateUserPassword = async (id: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return prisma.userMaster.update({
    where: { id: id },
    data: {
        passwordHash: hashedPassword
    },
    select: {
     id: true,
     role: true,
     email: true,
     userName: true,
     description: true,
     createdAt: true,
     updatedAt: true,
    }
  });
};
