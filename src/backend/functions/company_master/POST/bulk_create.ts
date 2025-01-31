import prisma from "../../../../../prisma/client";

export const createBulkCompanies = async (
  companies: Array<{
    name: string;
    description: string;
    size: number;
    url: string;
    is_active?: boolean;
    created_by?: string;
  }>
) => {
  return await prisma.companyMaster.createMany({
    data: companies.map((company) => ({
      name: company.name,
      description: company.description,
      size: company.size,
      isActive: company.is_active ?? true,
      createdBy: company.created_by || null,
      updatedBy: company.created_by || null,
      updatedAt: new Date()
    })),
    skipDuplicates: true,
  });
};
