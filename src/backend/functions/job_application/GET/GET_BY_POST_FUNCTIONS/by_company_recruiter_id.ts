import prisma from "../../../../../../prisma/client";

export const getByCompanyAndRecruiterID = async (
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