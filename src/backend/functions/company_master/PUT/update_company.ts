import prisma from "../../../../../prisma/client";

export const updateCompany = async (id: string, data: Partial<{ 
    name: string;
    size: number;
    url: string;
    description: string;
    isActive: boolean; 
  }>) => {
    return prisma.companyMaster.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  };