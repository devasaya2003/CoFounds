import prisma from "../../../../../prisma/client";

export const getUserEducationByUserID = async (user_id: string) => {
  return prisma.userEducation.findMany({
    where: { userId: user_id, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      eduFrom: true,
      degree: {
        select: {
            id: true,
            name: true
        }
      },
      startedAt: true,
      endAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
