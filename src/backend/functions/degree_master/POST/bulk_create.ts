import prisma from "../../../../../prisma/client";

export const createBulkDegrees = async (
  degrees: Array<{
    name: string;
    type: string;
    is_active?: boolean;
    created_by?: string;
  }>
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
