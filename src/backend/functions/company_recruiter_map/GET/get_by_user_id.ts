import prisma from "../../../../../prisma/client";

export const getByUserID = async (user_Id: string) => {
  return prisma.companyRecruiterMap.findUnique({
    where: { userId: user_Id },
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
