import prisma from "../../../../../prisma/client";

export const getPaginatedSkills = async (page: number) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const skills = await prisma.skillMaster.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalSkills = await prisma.skillMaster.count();

  return {
    skills,
    totalSkills,
    totalPages: Math.ceil(totalSkills / limit),
    currentPage: page,
  };
};
