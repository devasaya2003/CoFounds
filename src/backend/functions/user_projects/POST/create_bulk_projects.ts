import prisma from "../../../../../prisma/client";

export interface CreateBulkUserProjects {
  user_id: string;
  projects: {
    end_at: Date;
    started_at: Date;
    title: string;
    link: string;
    description?: string;
    is_active?: boolean;
  }[];
}

export const createBulkUserProjects = async (data: CreateBulkUserProjects) => {
  const formattedData = data.projects.map((project) => ({
    userId: data.user_id,
    startedAt: project.started_at,
    endAt: project.end_at,
    title: project.title,
    link: project.link,
    description: project.description ?? null,
    isActive: true,
    createdBy: data.user_id,
    updatedBy: data.user_id,
  }));

  return prisma.userProjects.createMany({
    data: formattedData,
  });
};
