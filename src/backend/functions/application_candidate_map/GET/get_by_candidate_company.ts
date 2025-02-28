import prisma from "../../../../../prisma/client";

export const getApplicationsByCandidateAndCompanyId = async (
  candidate_id: string,
  company_id: string
) => {
  return await prisma.applicationCandidateMap.findMany({
    where: {
      isActive: true,
      userId: candidate_id,
      job: { companyId: company_id },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      job: {
        select: {
          id: true,
          title: true,
          assignmentLink: true,
          location: true,
          package: true,
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
        },
      },
      status: true,
      assignmentLink: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
