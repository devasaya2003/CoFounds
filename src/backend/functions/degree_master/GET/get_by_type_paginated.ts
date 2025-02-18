import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getPaginatedDegreesByType = async (type: string, page: number) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const degrees = await prisma.degreeMaster.findMany({
        where: { type, isActive: true },
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
        skip: skip,
        take: ITEMS_PER_PAGE,
    });

    const totalDegrees = await prisma.degreeMaster.count({ where: { type, isActive: true } });

    return {
        currentPage: page,
        totalPages: Math.ceil(totalDegrees / ITEMS_PER_PAGE),
        totalDegrees,
        degrees,
    };
};