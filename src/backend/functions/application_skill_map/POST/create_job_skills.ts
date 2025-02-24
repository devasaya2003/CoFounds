import prisma from "../../../../../prisma/client";
import { SkillLevel } from "@prisma/client";

export const createJobSkills = async (
  job_id: string,
  skills: string[],
  skill_level: string,
  is_active: boolean,
  created_by: string
) => {
  return await prisma.applicationSkillMap.createMany({
    data: skills.map((skillId) => ({
      jobId: job_id,
      skillId: skillId,
      skillLevel: skill_level as SkillLevel,
      isActive: is_active ?? true,
      createdBy: created_by || null,
      updatedBy: created_by || null,
      updatedAt: new Date(),
    })),
  });
};
