import prisma from "../../../../../../prisma/client";

export const buildDeleteOperation = (job_id: string, skillId: string) =>
  prisma.applicationSkillMap.deleteMany({
    where: { jobId: job_id, skillId },
  });
