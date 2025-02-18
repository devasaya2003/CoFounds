import { UpdateBulkCompany } from "@/backend/interfaces/PUT/update_bulk_company";
import prisma from "../../../../../prisma/client";
import { UUID_REGEX } from "@/backend/constants/constants";

export const updateBulkCompanies = async (companies: UpdateBulkCompany[]) => {

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