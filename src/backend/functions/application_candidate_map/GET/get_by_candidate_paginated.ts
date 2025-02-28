import { ITEMS_PER_PAGE } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

export const getApplicationsByCandidateIdPaginated = async (
  candidate_id: string,
  page: number
) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const applications = await prisma.applicationCandidateMap.findMany({
    where: { isActive: true, userId: candidate_id },
    skip,
    take: ITEMS_PER_PAGE,
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
  const total = await prisma.applicationCandidateMap.count({
    where: { isActive: true, userId: candidate_id },
  });
  return {
    applications,
    total,
    page,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
  };
};
