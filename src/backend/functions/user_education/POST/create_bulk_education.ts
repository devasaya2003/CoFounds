import prisma from "../../../../../prisma/client";

export interface CreateBulkUserEducation {
  user_id: string;
  education: {
    degree_id: string;
    end_at: Date | null;
    started_at: Date;
    edu_from: string;
    is_active?: boolean;
  }[];
}

export const createBulkUserEducation = async (data: CreateBulkUserEducation) => {
  const formattedData = data.education.map((edu) => ({
    userId: data.user_id,
    degreeId: edu.degree_id,
    startedAt: edu.started_at,
    endAt: edu.end_at,
    eduFrom: edu.edu_from,
    isActive: true,
    createdBy: data.user_id,
    updatedBy: data.user_id,
  }));

  return prisma.userEducation.createMany({
    data: formattedData,
  });
};
