import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getAllJobSkillsByJobIDPaginated = async (
  job_id: string,
  page: number
) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const skills = await prisma.applicationSkillMap.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: { isActive: true, jobId: job_id },
    select: {
      id: true,
      skillLevel: true,
      jobId: true,
      skill: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalSkills = await prisma.applicationSkillMap.count({
    where: { isActive: true, jobId: job_id },
  });
  return {
    skills,
    totalSkills,
    totalPages: Math.ceil(totalSkills / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
