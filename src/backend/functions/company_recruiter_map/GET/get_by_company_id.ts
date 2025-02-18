import prisma from "../../../../../prisma/client";

export const getRecruitersByCompanyId = async (company_id: string) => {
  return await prisma.companyRecruiterMap.findMany({
    where: { companyId: company_id, isActive: true },
    select: {
      id: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          userName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          url: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};
