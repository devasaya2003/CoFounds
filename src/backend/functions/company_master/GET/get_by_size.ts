import prisma from "../../../../../prisma/client";

export const getCompaniesBySizeRange = async (low: number, high: number) => {
  return await prisma.companyMaster.findMany({
    where: {
      isActive: true,
      size: {
        gte: low,
        lte: high,
      },
    },
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