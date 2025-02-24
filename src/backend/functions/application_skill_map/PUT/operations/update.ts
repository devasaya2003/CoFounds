import { SkillLevel } from "@prisma/client";
import prisma from "../../../../../../prisma/client";

export const buildUpdateOperation = (
  job_id: string,
  skillId: string,
  skillLevel: string,
  updatedBy: string | null
) =>
  prisma.applicationSkillMap.updateMany({
    where: { jobId: job_id, skillId },
    data: {
      skillLevel: skillLevel as SkillLevel,
      isActive: true,
      updatedBy: updatedBy || null,
      updatedAt: new Date(),
    },
  });
