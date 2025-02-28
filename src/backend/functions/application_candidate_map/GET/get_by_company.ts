import prisma from "../../../../../prisma/client";

export const getApplicationsByCompanyId = async (company_id: string) => {
  return await prisma.applicationCandidateMap.findMany({
    where: {
      isActive: true,
      job: { companyId: company_id },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      job: {
        select: {
          id: true,
          companyId: true,
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
