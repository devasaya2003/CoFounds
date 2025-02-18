import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getAllRecruitersPaginated = async (page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const recruiters = await prisma.companyRecruiterMap.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
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

  const totalRecruiters = await prisma.companyRecruiterMap.count({where: {isActive: true}});
  return {
    recruiters,
    totalRecruiters,
    totalPages: Math.ceil(totalRecruiters / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
