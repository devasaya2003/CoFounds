import prisma from "../../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getByCompanyAndRecruiterID = async (
  company_id: string,
  recruiter_id: string,
  page: number
) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const jobs = await prisma.jobApplication.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: {
      companyId: company_id,
      recruiterId: recruiter_id,
      isActive: true,
    },
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
    where: {
      companyId: company_id,
      recruiterId: recruiter_id,
      isActive: true,
    },
  });
  return {
    jobs,
    totalJobs,
    totalPages: Math.ceil(totalJobs / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
