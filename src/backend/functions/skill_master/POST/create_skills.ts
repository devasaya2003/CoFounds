import prisma from "../../../../../prisma/client";

export const createSkill = async (data: {
  name: string;
  is_active?: boolean;
  created_by: string;
}) => {
  return await prisma.skillMaster.create({
    data: {
      name: data.name,
      isActive: data.is_active ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.created_by || null,
      updatedAt: new Date(),
    },
  });
};
