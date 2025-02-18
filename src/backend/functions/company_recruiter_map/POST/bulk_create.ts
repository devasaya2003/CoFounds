import { CreateRecruiter } from "@/backend/interfaces/POST/create_recruiter";
import prisma from "../../../../../prisma/client";

export const createBulkRecruiters = async (data: Array<CreateRecruiter>) => {
  return await prisma.companyRecruiterMap.createMany({
    data: data.map((recruiter) => ({
      userId: recruiter.user_id,
      companyId: recruiter.company_id,
      isActive: recruiter.is_active ?? true,
      createdBy: recruiter.created_by || null,
      updatedBy: recruiter.created_by || null,
      updatedAt: new Date(),
    })),
    skipDuplicates: true,
  });
};
