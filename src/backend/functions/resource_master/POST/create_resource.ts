import { CreateResource } from "@/backend/interfaces/POST/create_resource";
import prisma from "../../../../../prisma/client";

export const createResource = async (data: CreateResource) => {
  return await prisma.resourceMaster.create({
    data: {
      title: data.title,
      link: data.link,
      image: data.image,
      isActive: data.is_active ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.created_by || null,
      updatedAt: new Date()
    },
  });
};
