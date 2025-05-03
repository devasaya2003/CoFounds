import { ITEMS_PER_PAGE } from "@/backend/constants/constants";
import prisma from "../../../../../../prisma/client";

export const getByCompanyID = async (id: string, page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const jobs = await prisma.jobApplication.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: { companyId: id, isActive: true },
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
      applications: {
        select: {
          id: true,
          status: true
        }
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
      recruiter: {
        select: {
          id: true,
          email: true,
          userName: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  
  const jobsWithStatusCounts = jobs.map(job => {    
    const statusCounts = {
      applied: 0,
      under_review: 0,
      inprogress: 0,
      rejected: 0,
      closed: 0
    };
        
    job.applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });
        
    const { applications, ...jobWithoutApplications } = job;
    return {
      ...jobWithoutApplications,
      statusCounts
    };
  });

  const totalJobs = await prisma.jobApplication.count({
    where: {
      companyId: id,
      isActive: true,
    },
  });
  
  return {
    jobs: jobsWithStatusCounts,
    totalJobs,
    totalPages: Math.ceil(totalJobs / ITEMS_PER_PAGE),
    currentPage: page,
  };
};