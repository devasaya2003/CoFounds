import prisma from "../../../../../prisma/client";

export interface CreateBulkUserExperience {
  user_id: string;
  experiences: {
    end_at: Date;
    started_at: Date;
    company_name: string;
    title: string;
    description?: string;
    is_active?: boolean;
  }[];
}

export const createBulkUserExperience = async (data: CreateBulkUserExperience) => {
  const formattedData = data.experiences.map((experience) => ({
    userId: data.user_id,
    startedAt: experience.started_at,
    endAt: experience.end_at,
    companyName: experience.company_name,
    title: experience.title,
    description: experience.description ?? null,
    isActive: true,
    createdBy: data.user_id,
    updatedBy: data.user_id,
  }));

  return prisma.userExperience.createMany({
    data: formattedData,
  });
};
