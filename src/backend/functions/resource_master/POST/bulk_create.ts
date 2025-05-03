import { CreateResource } from "@/backend/interfaces/POST/create_resource";
import prisma from "../../../../../prisma/client";

export const createBulkResources = async (
  resources: Array<CreateResource>
) => {
  return await prisma.resourceMaster.createMany({
    data: resources.map((resource) => ({
      title: resource.title,
      link: resource.link,
      image: resource.image,
      isActive: resource.is_active ?? true,
      createdBy: resource.created_by || null,
      updatedBy: resource.created_by || null,
      updatedAt: new Date()
    })),
    skipDuplicates: true,
  });
};
