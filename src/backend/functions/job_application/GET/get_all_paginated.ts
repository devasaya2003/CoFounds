import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getAllJobsPaginated = async (page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const jobs = await prisma.jobApplication.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: { isActive: true },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      jobCode: true,
      requestedBy: true,
      assignmentLink: true,
      location: true,
      package: true,
      jobDescription: true,
      endAt: true,
      createdAt: true,
      updatedAt: true,
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
      recruiter: {
        select: {
          id: true,
          email: true,
          userName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const totalJobs = await prisma.jobApplication.count({
    where: { isActive: true },
  });
  return {
    jobs,
    totalJobs,
    totalPages: Math.ceil(totalJobs / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
