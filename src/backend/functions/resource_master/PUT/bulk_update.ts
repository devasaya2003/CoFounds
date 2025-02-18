import { UUID_REGEX } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";
import { UpdateBulkResource } from "@/backend/interfaces/PUT/update_bulk_resource";

export const updateBulkResources = async (resources: UpdateBulkResource[]) => {
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