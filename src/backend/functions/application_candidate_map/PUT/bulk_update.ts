import prisma from "../../../../../prisma/client";
import { ApplicationStatus } from "@prisma/client";

export interface BulkUpdateApplicationPayload {
  id: string;
  updated_by: string;
  status: string;
}

export const bulkUpdateApplications = async (
  updates: BulkUpdateApplicationPayload[]
) => {
  const operations = updates.map((update) =>
    prisma.applicationCandidateMap.update({
      where: { id: update.id },
      data: {
        status: update.status as ApplicationStatus,
        updatedBy: update.updated_by,
        updatedAt: new Date(),
      },
    })
  );

  return await prisma.$transaction(operations);
};