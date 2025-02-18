import { ITEMS_PER_PAGE } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

export const getPaginatedDegrees = async (page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const degrees = await prisma.degreeMaster.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: {isActive: true},
    orderBy: {
      updatedAt: "desc",
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

  const totalDegrees = await prisma.degreeMaster.count({where: {isActive: true}});

  return {
    degrees,
    totalDegrees,
    totalPages: Math.ceil(totalDegrees / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
