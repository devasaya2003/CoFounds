import { CreateQuestions } from "@/backend/interfaces/POST/create_questions";
import prisma from "../../../../../prisma/client";

export const createQuestions = async (
  payload: CreateQuestions
) => {
  return prisma.extraQuestions.createMany({
    data: payload.questions.map((question) => ({
      jobId: payload.job_id,
      question: question,
      isActive: payload.is_active == null ? true : payload.is_active,
      createdBy: payload.created_by,
      updatedBy: payload.created_by,
    })),
  });
};
