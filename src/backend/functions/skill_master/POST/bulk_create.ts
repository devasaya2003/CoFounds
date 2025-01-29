import prisma from "../../../../../prisma/client";

export const createBulkSkills = async (
  skills: Array<{
    name: string;
    is_active?: boolean;
    created_by?: string;
  }>
) => {
  return await prisma.skillMaster.createMany({
    data: skills.map((skill) => ({
      name: skill.name,
      isActive: skill.is_active ?? true,
      createdBy: skill.created_by || null,
      updatedBy: skill.created_by || null,
      updatedAt: new Date(),
    })),
    skipDuplicates: true,
  });
};
