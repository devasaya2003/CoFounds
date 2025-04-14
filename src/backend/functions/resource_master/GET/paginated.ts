import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getPaginatedResources = async (page: number) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
  
    const resources = await prisma.resourceMaster.findMany({
      skip: skip,
      take: ITEMS_PER_PAGE,
      where: {isActive: true},
      orderBy: {
        title: "desc",
      },
      select: {
        id: true,
        title: true,
        link: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  
    const totalResources = await prisma.resourceMaster.count({where: {isActive: true}});
    return {
      resources,
      totalResources,
      totalPages: Math.ceil(totalResources / ITEMS_PER_PAGE),
      currentPage: page,
    };
  };
  