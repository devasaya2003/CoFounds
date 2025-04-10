import prisma from "../../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getByCompanyAndRecruiterID = async (
  company_id: string,
  recruiter_id: string,
  page: number
) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  // Get jobs with their applications
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

  // Process jobs to include status counts
  const jobsWithStatusCounts = jobs.map(job => {
    // Initialize counts for all statuses
    const statusCounts = {
      applied: 0,
      under_review: 0,
      inprogress: 0,
      rejected: 0,
      closed: 0
    };
    
    // Count applications by status
    job.applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });
    
    // Return job with status counts but without applications array
    const { applications, ...jobWithoutApplications } = job;
    return {
      ...jobWithoutApplications,
      statusCounts
    };
  });

  const totalJobs = await prisma.jobApplication.count({
    where: {
      companyId: company_id,
      recruiterId: recruiter_id,
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