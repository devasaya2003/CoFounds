import { SkillLevel } from "@prisma/client";
import prisma from "../../../../../prisma/client";

export interface CreateBulkUserSkillset {
  user_id: string;
  skills: {
    skill_id: string;
    skill_level: string;
  }[];
}

export const createBulkUserSkillset = async (data: CreateBulkUserSkillset) => {
  const formattedData = data.skills.map((skillset) => ({
    userId: data.user_id,
    skillId: skillset.skill_id,
    skillLevel: skillset.skill_level as SkillLevel,
    isActive: true,
    createdBy: data.user_id,
    updatedBy: data.user_id,
  }));

  return prisma.userSkillset.createMany({
    data: formattedData,
  });
};
