import prisma from "../../../../../../prisma/client";

export const buildDeleteOperation = (
  job_id: string,
  skillId: string,
  updatedBy?: string | null
) =>
  prisma.applicationSkillMap.updateMany({
    where: { jobId: job_id, skillId },
    data: {
      isActive: false,
      updatedBy: updatedBy || null,
      updatedAt: new Date(),
    },
  });
