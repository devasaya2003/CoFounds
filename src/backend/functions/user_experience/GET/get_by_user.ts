import prisma from "../../../../../prisma/client";

export const getUserExperienceByUserID = async (user_id: string) => {
  return prisma.userExperience.findMany({
    where: { userId: user_id, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      companyName: true,
      title: true,
      description: true,
      startedAt: true,
      endAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
