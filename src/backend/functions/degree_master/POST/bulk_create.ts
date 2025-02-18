import { CreateDegree } from "@/backend/interfaces/POST/create_degree";
import prisma from "../../../../../prisma/client";

export const createBulkDegrees = async (
  degrees: Array<CreateDegree>
) => {
  return await prisma.degreeMaster.createMany({
    data: degrees.map((degree) => ({
      name: degree.name,
      type: degree.type,
      isActive: degree.is_active ?? true,
      createdBy: degree.created_by || null,
      updatedBy: degree.created_by || null,
      updatedAt: new Date(),
    })),
    skipDuplicates: true,
  });
};
