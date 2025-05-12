import prisma from "../../../../../prisma/client";
import { ProjectUpdatePayload } from "@/app/(protected-candidate)/candidate/profile/edit/components/project/types";

export async function updateUserProjects(payload: ProjectUpdatePayload) {
    try {
        const now = new Date();
        const userId = payload.user_id;
        
        if (
            payload.updated_projects.length === 0 &&
            payload.new_projects.length === 0 &&
            payload.deleted_projects.length === 0
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
            
            // Update existing projects
            if (payload.updated_projects.length > 0) {
                const updatePromises = payload.updated_projects.map((proj) => {
                    return tx.userProjects.update({
                        where: {
                            id: proj.id,
                            userId: userId,
                            isActive: true,
                        },
                        data: {
                            title: proj.title,
                            description: proj.description,
                            link: proj.link,
                            startedAt: proj.started_at ? new Date(proj.started_at) : null,
                            endAt: proj.end_at ? new Date(proj.end_at) : null,
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
            
            // Create new projects
            if (payload.new_projects.length > 0) {
                const createPromises = payload.new_projects.map((proj) => {
                    return tx.userProjects.create({
                        data: {
                            userId: userId,
                            title: proj.title,
                            description: proj.description,
                            link: proj.link,
                            startedAt: proj.started_at ? new Date(proj.started_at) : null,
                            endAt: proj.end_at ? new Date(proj.end_at) : null,
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
            
            // Soft delete projects
            if (payload.deleted_projects.length > 0) {
                const deletePromises = payload.deleted_projects.map((projId) => {
                    return tx.userProjects.update({
                        where: {
                            id: projId,
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
        console.error("Error updating user projects:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}