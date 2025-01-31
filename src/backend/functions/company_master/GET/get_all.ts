import prisma from "../../../../../prisma/client";

export const getAllCompanies = async () => {
    return prisma.companyMaster.findMany({
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
  