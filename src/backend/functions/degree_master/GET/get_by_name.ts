import prisma from "../../../../../prisma/client";

export const getDegreeByName = async (name: string) => {
    return prisma.degreeMaster.findUnique({
        where: {name},
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