import prisma from "../../../../../prisma/client";

export interface CreateUserExperience {
  user_id: string;
  end_at: Date;
  started_at: Date;
  company_name: string;
  title: string;
  description: string;
  is_active: boolean;
}

export const createUserExperience = async (data: CreateUserExperience) => {
  return prisma.userExperience.create({
    data: {
      userId: data.user_id,
      startedAt: data.started_at,
      endAt: data.end_at,
      companyName: data.company_name,
      title: data.title,
      description: data.description ?? null,
      isActive: data.is_active ?? true,
      createdBy: data.user_id,
      updatedBy: data.user_id
    },
  });
};
