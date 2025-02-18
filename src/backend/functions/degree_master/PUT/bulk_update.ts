import { UUID_REGEX } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";
import { UpdateBulkDegree } from "@/backend/interfaces/PUT/update_bulk_degree";

export const updateBulkDegrees = async (degrees: UpdateBulkDegree[]) => {
    const invalidIds = degrees.filter(degree => !UUID_REGEX.test(degree.id));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid UUID format found for ids: ${invalidIds.map(degree => degree.id).join(', ')}`);
    }

    try {
        const updatePromises = degrees.map(degree => prisma.degreeMaster.update({
            where: {id: degree.id},
            data: {
                ...degree.data,
                updatedAt: new Date(),
            },
        }));
        return await Promise.all(updatePromises);
    } catch (error) {
        console.error("Bulk update failed: ", error);
        throw error;
    };
};