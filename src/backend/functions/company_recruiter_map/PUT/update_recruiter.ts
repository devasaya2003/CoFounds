import { UpdateRecruiter } from "@/backend/interfaces/PUT/update_recruiter";
import prisma from "../../../../../prisma/client";

export const updateRecruiter = async (
  user_id: string,
  data: Partial<UpdateRecruiter>
) => {
  return prisma.companyRecruiterMap.update({
    where: { userId: user_id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};
