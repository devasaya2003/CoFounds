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
      is_active: resource.is_active ?? true,
      created_by: resource.created_by || null,
      updated_by: resource.created_by || null,
      updated_at: new Date()
    })),
    skipDuplicates: true, // Skip duplicate entries
  });
};
