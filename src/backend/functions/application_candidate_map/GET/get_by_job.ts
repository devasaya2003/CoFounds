import prisma from "../../../../../prisma/client";

export const getApplicationByJobId = async (job_id: string) => {
  return prisma.applicationCandidateMap.findMany({
    where: { isActive: true, jobId: job_id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      jobId: true,
      status: true,
      assignmentLink: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
