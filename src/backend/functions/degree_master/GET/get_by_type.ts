import prisma from "../../../../../prisma/client";

export const getDegreeByType = async (type: string) => {
    return prisma.degreeMaster.findMany({
        where: {type},
        select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};