import { BOTH, COMPANY, RECRUITER } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

interface GetJobsByPost {
  type: string;
  id: string; // company-id or recruiter-id
  extra_id: Partial<string>; // only when company-id and recruiter-id both required. This will always be recruiter-id
}

export const getJobsByPost = async (data: GetJobsByPost) => {
  const identifier = data.type;
  switch (identifier) {
    case BOTH:
      getByCompanyAndRecruiterID(data.id, data.extra_id);
      break;
    case COMPANY:
      getByCompanyID(data.id);
      break;
    case RECRUITER:
      getByRecruiterID(data.id);
      break;
    default:
      return "Wrong identifier!";
      break;
  }
};

const getByCompanyID = async (id: string) => {
  return prisma.jobApplication.findMany({
    where: { companyId: id, isActive: true },
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
};

const getByRecruiterID = async (id: string) => {
  return prisma.jobApplication.findMany({
    where: { recruiterId: id, isActive: true },
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
};

const getByCompanyAndRecruiterID = async (
  company_id: string,
  recruiter_id: string
) => {
  return prisma.jobApplication.findMany({
    where: {
      companyId: company_id,
      recruiterId: recruiter_id,
      isActive: true,
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
};
