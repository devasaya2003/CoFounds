import prisma from "../../../../../prisma/client";

export const createBulkWaitlist = async (
  WaitlistArray: Array<{
    email: string;
    phone: string;
    preferredRole: string;
  }>
) => {
  return await prisma.waitListTable.createMany({
    data: WaitlistArray.map((WaitlistData) => ({
      email: WaitlistData.email,
      phone: WaitlistData.phone,
      preferredRole: WaitlistData.preferredRole
    })),
    skipDuplicates: true
  });
};
