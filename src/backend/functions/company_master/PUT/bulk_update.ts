import prisma from "../../../../../prisma/client";
import { UUID_REGEX } from "@/backend/constants/constants";

interface UpdateCompanyData {
  id: string;
  data: Partial<{
    name: string;
    size: number;
    url: string;
    description: string;
    isActive: boolean;
  }>;
}

export const updateBulkCompanies = async (companies: UpdateCompanyData[]) => {
  console.log("************Starting bulk update process...");

  const invalidIds = companies.filter(r => !UUID_REGEX.test(r.id));
  if (invalidIds.length > 0) {
    throw new Error(`Invalid UUID format found for ids: ${invalidIds.map(r => r.id).join(', ')}`);
  }

  try {
    const updatePromises = companies.map(company => 
      prisma.companyMaster.update({
        where: { id: company.id },
        data: {
          ...company.data,
          updatedAt: new Date(),
        },
      })
    );

    return await Promise.all(updatePromises);
  } catch (error) {
    console.error("Bulk update failed:", error);
    throw error;
  }
};