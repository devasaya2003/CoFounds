import prisma from "../../../../../prisma/client";

export const getAllJobApplications = async () => {
  return prisma.jobApplication.findMany({
    where: { isActive: true },
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
