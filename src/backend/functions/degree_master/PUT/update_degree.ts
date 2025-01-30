import prisma from "../../../../../prisma/client";

export const updateDegree = async (
  id: string,
  data: Partial<{
    name: string;
    type: string;
    is_active: boolean;
  }>
) => {
  return prisma.degreeMaster.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};
