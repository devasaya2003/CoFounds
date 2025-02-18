import { CreateCompany } from "@/backend/interfaces/POST/create_company";
import prisma from "../../../../../prisma/client";

export const createCompany = async (data: CreateCompany) => {
  return await prisma.companyMaster.create({
    data: {
      name: data.name,
      size: data.size,
      url: data.url,
      description: data.description,
      isActive: data.is_active ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.created_by || null,
      updatedAt: new Date()
    },
  });
};
