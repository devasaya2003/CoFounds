import { ApplicationStatus } from "@prisma/client";
import prisma from "../../../../../prisma/client";
import { CreateApplication } from "@/backend/interfaces/POST/create_application";

export const createApplication = async (payload: CreateApplication) => {
  return prisma.applicationCandidateMap.create({
    data: {
      userId: payload.user_id,
      jobId: payload.job_id,
      status: "applied" as ApplicationStatus,
      assignmentLink: payload.assignment_link ?? null,
      isActive: true,
      createdBy: payload.user_id,
      updatedBy: payload.user_id,
    },
  });
};
