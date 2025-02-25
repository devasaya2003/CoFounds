import prisma from "../../../../../prisma/client";

export const getAllQuestionsByJobId = async (job_id: string) => {
  const questions = await prisma.extraQuestions.findMany({
    where: { jobId: job_id, isActive: true },
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
  return questions;
};
