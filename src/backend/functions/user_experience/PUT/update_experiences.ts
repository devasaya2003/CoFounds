import prisma from "../../../../../prisma/client";
import { ProofOfWorkUpdatePayload } from "@/app/(protected-candidate)/candidate/profile/edit/components/proof-of-work/types";

export async function updateUserExperiences(payload: ProofOfWorkUpdatePayload) {
    try {
        const now = new Date();
        const userId = payload.user_id;
        
        if (
            payload.updated_experiences.length === 0 &&
            payload.new_experiences.length === 0 &&
            payload.deleted_experiences.length === 0
        ) {
            return {
                success: true,
                data: {
                    updated: 0,
                    created: 0,
                    deleted: 0,
                    total: 0
                }
            };
        }

        const result = await prisma.$transaction(async (tx) => {            
            const allPromises = [];
            let updatedCount = 0;
            let createdCount = 0;
            let deletedCount = 0;
            
            if (payload.updated_experiences.length > 0) {
                const updatePromises = payload.updated_experiences.map((exp) => {
                    return tx.userExperience.update({
                        where: {
                            id: exp.id,
                            userId: userId,
                            isActive: true,
                        },
                        data: {
                            title: exp.title,
                            companyName: exp.is_community_work ? 'COF_PROOF_COMMUNITY' : (exp.company || ''),
                            description: exp.description,
                            startedAt: exp.started_at ? new Date(exp.started_at) : null,
                            endAt: exp.end_at ? new Date(exp.end_at) : null,
                            updatedBy: userId,
                            updatedAt: now,
                        },
                    });
                });
                allPromises.push(Promise.all(updatePromises).then(results => {
                    updatedCount = results.length;
                    return results;
                }));
            }
            
            if (payload.new_experiences.length > 0) {
                const createPromises = payload.new_experiences.map((exp) => {
                    return tx.userExperience.create({
                        data: {
                            userId: userId,
                            title: exp.title,
                            // For community work, store a special marker in companyName
                            companyName: exp.is_community_work ? 'COF_PROOF_COMMUNITY' : (exp.company || ''),
                            description: exp.description,
                            startedAt: exp.started_at ? new Date(exp.started_at) : null,
                            endAt: exp.end_at ? new Date(exp.end_at) : null,
                            isActive: true,
                            createdBy: userId,
                            updatedBy: userId,
                        },
                    });
                });
                allPromises.push(Promise.all(createPromises).then(results => {
                    createdCount = results.length;
                    return results;
                }));
            }
            
            if (payload.deleted_experiences.length > 0) {
                const deletePromises = payload.deleted_experiences.map((expId) => {
                    return tx.userExperience.update({
                        where: {
                            id: expId,
                            userId: userId,
                            isActive: true,
                        },
                        data: {
                            isActive: false,
                            updatedBy: userId,
                            updatedAt: now,
                        },
                    });
                });
                allPromises.push(Promise.all(deletePromises).then(results => {
                    deletedCount = results.length;
                    return results;
                }));
            }
            
            await Promise.all(allPromises);

            return {
                updated: updatedCount,
                created: createdCount,
                deleted: deletedCount,
                total: updatedCount + createdCount + deletedCount,
            };
        });

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Error updating user experiences:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}