import prisma from "../../../../../prisma/client";
import { SkillLevel, UserSkillset } from "@prisma/client";

interface SkillsUpdatePayload {
    user_id: string;
    updated_skillset: Array<{
        skill_id: string;
        skill_level: SkillLevel;
    }>;
    new_skillset: Array<{
        skill_id: string;
        skill_level: SkillLevel;
    }>;
    deleted_skillset: string[];
}


type UserSkillsetWithStatus = UserSkillset & {
    reactivated?: boolean;
};

export async function updateUserSkills(payload: SkillsUpdatePayload) {
    try {
        const now = new Date();
        const userId = payload.user_id;

        const result = await prisma.$transaction(async (tx) => {

            const updatePromises = payload.updated_skillset.map((skill) => {
                return tx.userSkillset.updateMany({
                    where: {
                        userId: userId,
                        skillId: skill.skill_id,
                        isActive: true,
                    },
                    data: {
                        skillLevel: skill.skill_level,
                        updatedBy: userId,
                        updatedAt: now,
                    },
                });
            });


            const createResults: UserSkillsetWithStatus[] = [];
            for (const skill of payload.new_skillset) {

                const existingInactiveSkill = await tx.userSkillset.findFirst({
                    where: {
                        userId: userId,
                        skillId: skill.skill_id,
                        isActive: false,
                    },
                });

                if (existingInactiveSkill) {

                    const reactivated = await tx.userSkillset.update({
                        where: {
                            id: existingInactiveSkill.id,
                        },
                        data: {
                            isActive: true,
                            skillLevel: skill.skill_level,
                            updatedBy: userId,
                            updatedAt: now,
                        },
                    });

                    const reactivatedWithStatus: UserSkillsetWithStatus = {
                        ...reactivated,
                        reactivated: true
                    };
                    createResults.push(reactivatedWithStatus);
                } else {

                    const created = await tx.userSkillset.create({
                        data: {
                            userId: userId,
                            skillId: skill.skill_id,
                            skillLevel: skill.skill_level,
                            createdBy: userId,
                            updatedBy: userId,
                            isActive: true,
                        },
                    });
                    createResults.push(created);
                }
            }


            const deletePromises = payload.deleted_skillset.map((skillId) => {
                return tx.userSkillset.updateMany({
                    where: {
                        userId: userId,
                        skillId: skillId,
                        isActive: true,
                    },
                    data: {
                        isActive: false,
                        updatedBy: userId,
                        updatedAt: now,
                    },
                });
            });


            const [updated, deleted] = await Promise.all([
                Promise.all(updatePromises),
                Promise.all(deletePromises),
            ]);


            const reactivatedCount = createResults.filter(r => r.reactivated).length;
            const newlyCreatedCount = createResults.length - reactivatedCount;

            return {
                updated: updated.reduce((sum, result) => sum + result.count, 0),
                created: newlyCreatedCount,
                reactivated: reactivatedCount,
                deleted: deleted.reduce((sum, result) => sum + result.count, 0),
                total: updated.reduce((sum, result) => sum + result.count, 0) +
                    createResults.length +
                    deleted.reduce((sum, result) => sum + result.count, 0),
            };
        });

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Error updating user skills:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

