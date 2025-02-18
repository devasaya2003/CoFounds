import prisma from "../../../../../prisma/client";

export const getAllSkills = async () => {
    return prisma.skillMaster.findMany({
        where: {isActive: true},
        select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
          },
    });
};