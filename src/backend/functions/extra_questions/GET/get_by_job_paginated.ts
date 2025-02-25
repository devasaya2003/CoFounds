import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getAllQuestionsByJobIdPaginated = async (
  job_id: string,
  page_no: number
) => {
  const skip = (page_no - 1) * ITEMS_PER_PAGE;
  const questions = await prisma.extraQuestions.findMany({
    where: { jobId: job_id, isActive: true },
    skip: skip,
    take: ITEMS_PER_PAGE,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      question: true,
      job: {
        select: {
          id: true,
          companyId: true,
          recruiterId: true,
          requestedBy: true,
          jobCode: true,
          location: true,
          title: true,
          jobDescription: true,
          package: true,
          assignmentLink: true,
          endAt: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalQuestions = await prisma.extraQuestions.count({
    where: { isActive: true, jobId: job_id },
  });

  return {
    questions,
    totalQuestions,
    totalPages: Math.ceil(totalQuestions / ITEMS_PER_PAGE),
    currentPage: page_no,
  };
};
