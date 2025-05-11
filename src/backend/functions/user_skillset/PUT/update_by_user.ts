import { SkillsUpdatePayload } from "@/app/(protected-candidate)/candidate/profile/edit/components/types";
import prisma from "../../../../../prisma/client";
import { UserSkillset } from "@prisma/client";

type UserSkillsetWithStatus = UserSkillset & {
    reactivated?: boolean;
};

type PrismaUpdateResult = {
    count: number;
};

export async function updateUserSkills(payload: SkillsUpdatePayload) {
    try {
        const now = new Date();
        const userId = payload.user_id;

        if (
            payload.updated_skillset.length === 0 &&
            payload.new_skillset.length === 0 &&
            payload.deleted_skillset.length === 0
        ) {
            return {
                success: true,
                data: {
                    updated: 0,
                    created: 0,
                    reactivated: 0,
                    deleted: 0,
                    total: 0
                }
            };
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatePromises = [];
            const deletePromises = [];
            const createResults: UserSkillsetWithStatus[] = [];

            if (payload.updated_skillset.length > 0) {
                updatePromises.push(...payload.updated_skillset.map((skill) => {
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
                }));
            }

            if (payload.new_skillset.length > 0) {
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
            }

            if (payload.deleted_skillset.length > 0) {
                deletePromises.push(...payload.deleted_skillset.map((skillId) => {
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
                }));
            }

            let updatedResults: PrismaUpdateResult[] = [];
            let deletedResults: PrismaUpdateResult[] = [];

            if (updatePromises.length > 0) {
                updatedResults = await Promise.all(updatePromises);
            }

            if (deletePromises.length > 0) {
                deletedResults = await Promise.all(deletePromises);
            }

            const reactivatedCount = createResults.filter(r => r.reactivated).length;
            const newlyCreatedCount = createResults.length - reactivatedCount;

            return {
                updated: updatedResults.reduce((sum, result) => sum + result.count, 0),
                created: newlyCreatedCount,
                reactivated: reactivatedCount,
                deleted: deletedResults.reduce((sum, result) => sum + result.count, 0),
                total: updatedResults.reduce((sum, result) => sum + result.count, 0) +
                    createResults.length +
                    deletedResults.reduce((sum, result) => sum + result.count, 0),
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

