import { UpdateBulkRecruiters } from "@/backend/interfaces/PUT/update_bulk_recruiter";
import prisma from "../../../../../prisma/client";
import { UUID_REGEX } from "@/backend/constants/constants";

export const updateBulkRecruiter = async (
  recruiters: UpdateBulkRecruiters[]
) => {
  const invalidIds = recruiters.filter((r) => !UUID_REGEX.test(r.user_id));
  if (invalidIds.length > 0) {
    throw new Error(
      `Invalid UUID format found for ids: ${invalidIds
        .map((r) => r.user_id)
        .join(", ")}`
    );
  }

  try {
    const updatePromises = recruiters.map((recruiter) =>
      prisma.companyRecruiterMap.update({
        where: { id: recruiter.user_id },
        data: {
          ...recruiter.data,
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
