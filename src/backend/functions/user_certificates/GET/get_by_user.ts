import prisma from "../../../../../prisma/client";

export const getUserCertificatesByUserID = async (user_id: string) => {
  return prisma.userCertificates.findMany({
    where: { userId: user_id, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      link: true,
      filePath: true,
      startedAt: true,
      endAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
