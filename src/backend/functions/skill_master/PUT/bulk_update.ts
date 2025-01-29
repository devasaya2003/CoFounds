import prisma from "../../../../../prisma/client";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface UpdateSkillData {
    id: string;
    data: Partial<{
        name: string;
        isAvtive: boolean;
    }>;
}

export const updateBulkSkills = async (skills: UpdateSkillData[]) => {
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