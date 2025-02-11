import prisma from "../../../../../prisma/client";

export const createWaitlist = async (data: {
  email: string;
}) => {
  return await prisma.waitListTable.create({
    data: {
      email: data.email,
    },
  });
};