import prisma from "../../../../../prisma/client";

export const getAllJobSkillsByJobID = async (job_id: string) => {
  return await prisma.applicationSkillMap.findMany({
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
};
