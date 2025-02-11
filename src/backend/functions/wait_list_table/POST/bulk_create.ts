import prisma from "../../../../../prisma/client";

export const createBulkWaitlist = async (
  WaitlistArray: Array<{
    email: string;
  }>
) => {
  return await prisma.waitListTable.createMany({
    data: WaitlistArray.map((WaitlistData) => ({
      email: WaitlistData.email,
    })),
    skipDuplicates: true
  });
};
