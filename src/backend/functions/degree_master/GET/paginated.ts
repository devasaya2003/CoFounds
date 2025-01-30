import prisma from "../../../../../prisma/client";

export const getPaginatedDegrees = async (page: number) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const degrees = await prisma.degreeMaster.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalDegrees = await prisma.degreeMaster.count();

  return {
    degrees,
    totalDegrees,
    totalPages: Math.ceil(totalDegrees / limit),
    currentPage: page,
  };
};
