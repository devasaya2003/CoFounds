import prisma from "../../../../../prisma/client";

export const getUserProjectsByUserID = async (user_id: string) => {
  return prisma.userProjects.findMany({
    where: { userId: user_id, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      link: true,
      description: true,
      startedAt: true,
      endAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
