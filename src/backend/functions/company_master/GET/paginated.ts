import prisma from "../../../../../prisma/client";
import { ITEMS_PER_PAGE } from "@/backend/constants/constants";

export const getPaginatedCompanies = async (page: number) => {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const companies = await prisma.companyMaster.findMany({
    skip: skip,
    take: ITEMS_PER_PAGE,
    where: { isActive: true },
    orderBy: {
      updatedAt: "desc",
    },
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
  });

  const totalCompanies = await prisma.companyMaster.count({
    where: { isActive: true },
  });
  return {
    companies,
    totalCompanies,
    totalPages: Math.ceil(totalCompanies / ITEMS_PER_PAGE),
    currentPage: page,
  };
};
