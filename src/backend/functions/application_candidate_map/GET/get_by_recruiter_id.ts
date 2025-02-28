import prisma from "../../../../../prisma/client";

export const getApplicationsByRecruiterId = async (recruiter_id: string) => {
  return await prisma.applicationCandidateMap.findMany({
    where: {
      isActive: true,
      job: { recruiterId: recruiter_id },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      job: {
        select: {
          id: true,
          companyId: true,
          recruiterId: true,
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
