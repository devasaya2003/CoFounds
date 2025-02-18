import { ITEMS_PER_PAGE } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

export const getPaginatedSkills = async (page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const skills = await prisma.skillMaster.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: {isActive: true},
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalSkills = await prisma.skillMaster.count({where: {isActive: true}});

  return {
    skills,
    totalSkills,
    totalPages: Math.ceil(totalSkills / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
