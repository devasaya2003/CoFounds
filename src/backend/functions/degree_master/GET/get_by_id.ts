import prisma from "../../../../../prisma/client";

export const getDegreeById = async (id: string) => {
  return prisma.degreeMaster.findUnique({
    where: { id },
    omit: {
      createdBy: true,
      updatedBy: true,
    }
  });
};
