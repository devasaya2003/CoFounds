import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getPaginatedCompaniesByType = async (size: number, page: number) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const companies = await prisma.companyMaster.findMany({
        where: { size },
        select: {
            id: true,
            name: true,
            size: true,
            description: true,
            url: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        skip: skip,
        take: ITEMS_PER_PAGE,
    });

    const totalCompanies = await prisma.companyMaster.count({ where: { size } });

    return {
        currentPage: page,
        totalPages: Math.ceil(totalCompanies / ITEMS_PER_PAGE),
        totalCompanies,
        companies,
    };
};