import prisma from "../../../../../prisma/client";

export const updateSkill = async (
  id: string,
  data: Partial<{
    name: string;
    is_active: boolean;
  }>
) => {
  return prisma.skillMaster.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};
