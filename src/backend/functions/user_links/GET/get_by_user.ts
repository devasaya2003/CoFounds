import prisma from "../../../../../prisma/client";

export const getUserLinksByUserID = async (user_id: string) => {
  return prisma.userLinks.findMany({
    where: { userId: user_id, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      linkTitle: true,
      linkUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
