import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getAllJobSkillsBySkillIDPaginated = async (
  skill_id: string,
  page: number
) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const skills = await prisma.applicationSkillMap.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: { isActive: true, skillId: skill_id },
    select: {
      id: true,
      skillLevel: true,
      job: {
        select: {
          id: true,
          title: true,
          jobCode: true,
          requestedBy: true,
          assignmentLink: true,
          location: true,
          package: true,
          jobDescription: true,
          endAt: true,
          createdAt: true,
          updatedAt: true,
          companyId: true,
          recruiterId: true,
        },
      },
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
    where: { isActive: true, skillId: skill_id },
  });
  return {
    skills,
    totalSkills,
    totalPages: Math.ceil(totalSkills / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
