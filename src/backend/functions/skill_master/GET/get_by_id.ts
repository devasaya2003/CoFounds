import prisma from "../../../../../prisma/client";

export const getSkillById = async (id: string) => {
  return prisma.skillMaster.findUnique({
    where: { id },
    omit: {
      createdBy: true,
      updatedBy: true,
    }
  });
};
