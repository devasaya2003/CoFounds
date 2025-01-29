import prisma from "../../../prisma/client";

export const updateSkill = async (
  id: string,
  data: Partial<{
    name: string;
    is_active: boolean;
  }>
) => {
  return prisma.skill_master.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
};
