import { UpdateCompany } from "@/backend/interfaces/PUT/update_company";
import prisma from "../../../../../prisma/client";

export const updateCompany = async (id: string, data: Partial<UpdateCompany>) => {
    return prisma.companyMaster.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  };