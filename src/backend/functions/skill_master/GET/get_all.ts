import prisma from "../../../../../prisma/client";

export const getAllSkills = async () => {
    return prisma.skillMaster.findMany({
        select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};