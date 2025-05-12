import prisma from "../../../../../prisma/client";
import { EducationUpdatePayload } from "@/app/(protected-candidate)/candidate/profile/edit/components/education/types";

export async function updateUserEducation(payload: EducationUpdatePayload) {
    try {
        const now = new Date();
        const userId = payload.user_id;
        
        if (
            payload.updated_education.length === 0 &&
            payload.new_education.length === 0 &&
            payload.deleted_education.length === 0
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
            
            // Update existing education entries
            if (payload.updated_education.length > 0) {
                const updatePromises = payload.updated_education.map((edu) => {
                    return tx.userEducation.update({
                        where: {
                            id: edu.id,
                            userId: userId,
                            isActive: true,
                        },
                        data: {
                            degreeId: edu.degree_id,
                            eduFrom: edu.institution,
                            startedAt: edu.started_at ? new Date(edu.started_at) : null,
                            endAt: edu.end_at ? new Date(edu.end_at) : null,
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
            
            // Create new education entries
            if (payload.new_education.length > 0) {
                const createPromises = payload.new_education.map((edu) => {
                    return tx.userEducation.create({
                        data: {
                            userId: userId,
                            degreeId: edu.degree_id,
                            eduFrom: edu.institution,
                            startedAt: edu.started_at ? new Date(edu.started_at) : null,
                            endAt: edu.end_at ? new Date(edu.end_at) : null,
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
            
            // Soft delete education entries
            if (payload.deleted_education.length > 0) {
                const deletePromises = payload.deleted_education.map((eduId) => {
                    return tx.userEducation.update({
                        where: {
                            id: eduId,
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
        console.error("Error updating user education:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}