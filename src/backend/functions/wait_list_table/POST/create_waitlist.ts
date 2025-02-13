import prisma from "../../../../../prisma/client";

export const createWaitlist = async (data: {
  email: string;
}) => {
  const existingEmail = await prisma.waitListTable.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingEmail) {
    throw new Error("This email already exists!");
  }
  
  return await prisma.waitListTable.create({
    data: {
      email: data.email,
    },
  });
};