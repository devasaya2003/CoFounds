import { UpdateQuestions } from "@/backend/interfaces/PUT/update_questions";
import prisma from "../../../../../prisma/client";

export const updateQuestions = async (
  job_id: string,
  payload: UpdateQuestions
) => {
  const { updatedBy, actions } = payload;
  const operations = [];

  for (const actionDetail of actions) {
    switch (actionDetail.action) {
      case "delete":
        operations.push(
          prisma.extraQuestions.updateMany({
            where: { id: actionDetail.questionId, jobId: job_id },
            data: {
              isActive: false,
              updatedBy: updatedBy,
              updatedAt: new Date(),
            },
          })
        );
        break;
      case "update":
        operations.push(
          prisma.extraQuestions.update({
            where: { id: actionDetail.questionId },
            data: {
              question: actionDetail.question,
              updatedBy: updatedBy,
              updatedAt: new Date(),
            },
          })
        );
        break;
      case "add":
        operations.push(
          prisma.extraQuestions.create({
            data: {
              jobId: job_id,
              question: actionDetail.question,
              isActive: true,
              createdBy: updatedBy,
              updatedBy: updatedBy,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        );
        break;
      default:
        throw new Error("Unrecognized operation");
    }
  }

  return await prisma.$transaction(operations);
};
