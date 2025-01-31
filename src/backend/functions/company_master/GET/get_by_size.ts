import prisma from "../../../../../prisma/client";

export const getCompaniesBySize = async (size: number) => {
  return prisma.companyMaster.findMany({
    where: { size },
    select: {
      id: true,
      name: true,
      size: true,
      description: true,
      url: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
