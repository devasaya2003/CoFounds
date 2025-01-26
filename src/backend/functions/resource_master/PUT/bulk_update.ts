import prisma from "../../../../../prisma/client";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface UpdateResourceData {
  id: string;
  data: Partial<{
    title: string;
    link: string;
    image: string;
    is_active: boolean;
  }>;
}

export const updateBulkResources = async (resources: UpdateResourceData[]) => {
  console.log("************Starting bulk update process...");

  // Validate all UUIDs first
  const invalidIds = resources.filter(r => !UUID_REGEX.test(r.id));
  if (invalidIds.length > 0) {
    throw new Error(`Invalid UUID format found for ids: ${invalidIds.map(r => r.id).join(', ')}`);
  }

  try {
    const updatePromises = resources.map(resource => 
      prisma.resourceMaster.update({
        where: { id: resource.id },
        data: {
          ...resource.data,
          updatedAt: new Date(),
        },
      })
    );

    return await Promise.all(updatePromises);
  } catch (error) {
    console.error("Bulk update failed:", error);
    throw error;
  }
};