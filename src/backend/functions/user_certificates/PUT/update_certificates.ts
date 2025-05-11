import prisma from "../../../../../prisma/client";
import { CertificateUpdatePayload } from "@/app/(protected-candidate)/candidate/profile/edit/components/certificate/types";

export async function updateUserCertificates(payload: CertificateUpdatePayload) {
    try {
        const now = new Date();
        const userId = payload.user_id;
        
        if (
            payload.updated_certificates.length === 0 &&
            payload.new_certificates.length === 0 &&
            payload.deleted_certificates.length === 0
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
            
            if (payload.updated_certificates.length > 0) {
                const updatePromises = payload.updated_certificates.map((cert) => {
                    return tx.userCertificates.update({
                        where: {
                            id: cert.id,
                            userId: userId,
                            isActive: true,
                        },
                        data: {
                            title: cert.title,
                            description: cert.description,
                            link: cert.link,
                            startedAt: cert.started_at ? new Date(cert.started_at) : null,
                            endAt: cert.end_at ? new Date(cert.end_at) : null,
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
            
            if (payload.new_certificates.length > 0) {
                const createPromises = payload.new_certificates.map((cert) => {
                    return tx.userCertificates.create({
                        data: {
                            userId: userId,
                            title: cert.title,
                            description: cert.description,
                            link: cert.link,
                            filePath: null,
                            startedAt: cert.started_at ? new Date(cert.started_at) : null,
                            endAt: cert.end_at ? new Date(cert.end_at) : null,
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
            
            if (payload.deleted_certificates.length > 0) {
                const deletePromises = payload.deleted_certificates.map((certId) => {
                    return tx.userCertificates.update({
                        where: {
                            id: certId,
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
        console.error("Error updating user certificates:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}