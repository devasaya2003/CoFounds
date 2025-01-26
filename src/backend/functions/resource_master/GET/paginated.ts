import prisma from "../../../../../prisma/client";

export const getPaginatedResources = async (page: number) => {
    const limit = 9;
    const skip = (page - 1) * limit;
  
    const resources = await prisma.resourceMaster.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
      select: {
        title: true,
        link: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  
    const totalResources = await prisma.resourceMaster.count();
    return {
      resources,
      totalResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: page,
    };
  };
  