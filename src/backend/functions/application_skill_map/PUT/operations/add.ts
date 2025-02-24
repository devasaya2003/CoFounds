import { SkillLevel } from "@prisma/client";
import prisma from "../../../../../../prisma/client";

export const buildAddOperation = (
  job_id: string,
  skillId: string,
  skillLevel: string,
  updatedBy: string | null
) =>
  prisma.applicationSkillMap.create({
    data: {
      jobId: job_id,
      skillId,
      skillLevel: skillLevel as SkillLevel,
      isActive: true,
      createdBy: updatedBy || null,
      updatedBy: updatedBy || null,
      updatedAt: new Date(),
    },
  });
