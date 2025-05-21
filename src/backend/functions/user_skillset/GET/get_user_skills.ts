import prisma from "../../../../../prisma/client";

export const getUserSkills = async (user_id: string) => {
    return prisma.userSkillset.findMany({
        where: { userId: user_id, isActive: true },
        select: {
            id: true,
            skill: {
                select: {
                    id: true,
                    name: true,
                }
            },
            skillLevel: true,
            createdAt: true,
            updatedAt: true
        }
    });
}