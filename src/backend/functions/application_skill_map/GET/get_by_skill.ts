import prisma from "../../../../../prisma/client";

export const getAllJobSkillsBySkillID = async (skill_id: string) => {
  return await prisma.applicationSkillMap.findMany({
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
};
