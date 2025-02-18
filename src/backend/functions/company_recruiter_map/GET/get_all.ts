import prisma from "../../../../../prisma/client";

export const getAllRecruiters = async () => {
  return prisma.companyRecruiterMap.findMany({
    where: {isActive: true},
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          userName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          url: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};
