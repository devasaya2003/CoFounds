import { UUID_REGEX } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";

interface UpdateDegreeData {
    id: string;
    data: Partial<{
        name: string;
        type: string;
        isAvtive: boolean;
    }>;
}

export const updateBulkDegrees = async (degrees: UpdateDegreeData[]) => {
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