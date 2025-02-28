import { ITEMS_PER_PAGE } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

export const getApplicationsByJobId = async (job_id: string, page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const applications = await prisma.applicationCandidateMap.findMany({
    where: { jobId: job_id, isActive: true },
    skip,
    take: ITEMS_PER_PAGE,
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
  const total = await prisma.applicationCandidateMap.count({
    where: { jobId: job_id, isActive: true },
  });
  return {
    applications,
    total,
    page,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
  };
};
