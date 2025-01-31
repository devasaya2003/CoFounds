import prisma from "../../../../../prisma/client";

export const getCompanyByName = async (name: string) => {
    return prisma.companyMaster.findUnique({
        where: {name},
        select: {
            id: true,
            name: true,
            size: true,
            description: true,
            url: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};