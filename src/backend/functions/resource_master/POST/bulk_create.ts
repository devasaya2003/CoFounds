import prisma from "../../../../../prisma/client";

export const createBulkResources = async (
  resources: Array<{
    title: string;
    link?: string;
    image?: string;
    is_active?: boolean;
    created_by?: string;
  }>
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
    skipDuplicates: true, // Skip duplicate entries
  });
};
