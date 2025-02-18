import { CreateDegree } from "@/backend/interfaces/POST/create_degree";
import prisma from "../../../../../prisma/client";

export const createDegree = async (data: CreateDegree) => {
  return await prisma.degreeMaster.create({
    data: {
      name: data.name,
      type: data.type,
      isActive: data.is_active ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.created_by || null,
      updatedAt: new Date(),
    },
  });
};
