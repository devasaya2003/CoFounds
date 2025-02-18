import { CreateRecruiter } from "@/backend/interfaces/POST/create_recruiter";
import prisma from "../../../../../prisma/client";

export const createRecruiter = async (data: CreateRecruiter) => {
  return await prisma.companyRecruiterMap.create({
    data: {
      userId: data.user_id,
      companyId: data.company_id,
      isActive: data.is_active ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.created_by || null,
      updatedAt: new Date(),
    },
  });
};
