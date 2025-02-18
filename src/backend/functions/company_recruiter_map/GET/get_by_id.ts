import prisma from "../../../../../prisma/client";

export const getRecruiterById = async (id: string) => {
  return prisma.companyRecruiterMap.findUnique({
    where: { id: id },
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
