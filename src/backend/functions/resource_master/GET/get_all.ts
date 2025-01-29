import prisma from "../../../../../prisma/client";

export const getAllResources = async () => {
    return prisma.resourceMaster.findMany({
      select: {
        id: true,
        title: true,
        link: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };
  