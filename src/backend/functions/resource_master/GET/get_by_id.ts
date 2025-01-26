import prisma from "../../../../../prisma/client";

export const getResourceById = async (id: string) => {
  return prisma.resourceMaster.findUnique({
    where: { id },
  });
};
