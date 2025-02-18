import { UUID_REGEX } from "@/backend/constants/constants";
import prisma from "../../../../../prisma/client";
import { UpdateBulkSkill } from "@/backend/interfaces/PUT/update_bulk_skill";

export const updateBulkSkills = async (skills: UpdateBulkSkill[]) => {
    const invalidIds = skills.filter(skill => !UUID_REGEX.test(skill.id));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid UUID format found for ids: ${invalidIds.map(skill => skill.id).join(', ')}`);
    }

    try {
        const updatePromises = skills.map(skill => prisma.skillMaster.update({
            where: {id: skill.id},
            data: {
                ...skill.data,
                updatedAt: new Date(),
            },
        }));
        return await Promise.all(updatePromises);
    } catch (error) {
        console.error("Bulk update failed: ", error);
        throw error;
    };
};