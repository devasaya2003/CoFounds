import { ITEMS_PER_PAGE } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

export const getPaginatedDegrees = async (page: number) => {
  const highSchool = await prisma.degreeMaster.findFirst({
    where: {
      name: { contains: "High School", mode: "insensitive" },
      isActive: true
    },
    select: {
      id: true,
      name: true,
      type: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalDegrees = await prisma.degreeMaster.count({
    where: { isActive: true }
  });

  if (page === 1) {
    const otherDegrees = await prisma.degreeMaster.findMany({
      take: highSchool ? ITEMS_PER_PAGE - 1 : ITEMS_PER_PAGE,
      where: {
        isActive: true,
        NOT: highSchool ? { id: highSchool.id } : undefined
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        type: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const degrees = highSchool 
      ? [highSchool, ...otherDegrees] 
      : otherDegrees;
    
    return {
      degrees,
      totalDegrees,
      totalPages: Math.ceil(totalDegrees / ITEMS_PER_PAGE),
      currentPage: page,
    };
  }

  const adjustedSkip = ((page - 1) * ITEMS_PER_PAGE) - (highSchool ? 1 : 0);

  const degrees = await prisma.degreeMaster.findMany({
    skip: Math.max(0, adjustedSkip),
    take: ITEMS_PER_PAGE,
    where: {
      isActive: true,
      NOT: highSchool ? { id: highSchool.id } : undefined
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    degrees,
    totalDegrees,
    totalPages: Math.ceil(totalDegrees / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
