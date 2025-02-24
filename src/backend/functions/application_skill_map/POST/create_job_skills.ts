import prisma from "../../../../../prisma/client";
import { SkillLevel } from "@prisma/client";

interface Skills {
  skill_id: string;
  skill_level: string;
}

export const createJobSkills = async (
  job_id: string,
  skills: Skills[],
  is_active: boolean,
  created_by: string
) => {
  return await prisma.applicationSkillMap.createMany({
    data: skills.map((skill) => ({
      jobId: job_id,
      skillId: skill.skill_id,
      skillLevel: skill.skill_level as SkillLevel,
      isActive: is_active ?? true,
      createdBy: created_by || null,
      updatedBy: created_by || null,
      updatedAt: new Date(),
    })),
  });
};