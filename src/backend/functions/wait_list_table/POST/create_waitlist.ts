import prisma from "../../../../../prisma/client";

export const createWaitlist = async (data: {
  email: string;
  phone: string;
  preferredRole: string;
}) => {
  return await prisma.waitListTable.create({
    data: {
      email: data.email,
      phone: data.phone,
      preferredRole: data.preferredRole
    },
  });
};