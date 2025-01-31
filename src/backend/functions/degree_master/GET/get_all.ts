import prisma from "../../../../../prisma/client";

export const getAllDegrees = async () => {
    return prisma.degreeMaster.findMany({
        select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
          },
    });
};