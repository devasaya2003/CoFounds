import prisma from "../../../../../prisma/client";
import { ApplicationStatus } from "@prisma/client";

export const updateApplication = async (
  id: string,
  updated_by: string,
  status: string
) => {
  return await prisma.applicationCandidateMap.update({
    where: { id: id },
    data: {
      status: status as ApplicationStatus,
      updatedBy: updated_by,
      updatedAt: new Date(),
    },
  });
};