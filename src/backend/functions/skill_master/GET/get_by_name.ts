import prisma from "../../../../../prisma/client";

export const getSkillByName = async (name: string) => {
    return prisma.skillMaster.findUnique({
        where: {name},
        select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};