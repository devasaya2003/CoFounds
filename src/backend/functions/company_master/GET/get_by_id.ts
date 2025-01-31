import prisma from "../../../../../prisma/client";

export const getCompanyById = async (id: string) => {
  return prisma.companyMaster.findUnique({
    where: { id },
    omit: {
      createdBy: true,
      updatedBy: true,
    }
  });
};
