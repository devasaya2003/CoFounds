import prisma from "../../../../../prisma/client";

export const getAllResources = async () => {
    return prisma.resourceMaster.findMany({
      where: {isActive: true},
      select: {
        id: true,
        title: true,
        link: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  };
  