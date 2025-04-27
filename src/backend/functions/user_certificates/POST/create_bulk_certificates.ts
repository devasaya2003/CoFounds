import prisma from "../../../../../prisma/client";
import { uploadCertificateFile } from "./fileUtils";
import { CreateBulkCertificatesRequest, CreateBulkCertificatesResponse, DbCertificate } from "./types";

/**
 * Create bulk certificates for a user
 */
export async function createBulkCertificates(
    requestData: CreateBulkCertificatesRequest
): Promise<CreateBulkCertificatesResponse> {
    const { user_id, created_by, updated_by, certificates } = requestData;

    try {
        if (!user_id) {
            throw new Error('User ID is required');
        }

        if (!certificates || !Array.isArray(certificates) || certificates.length === 0) {
            throw new Error('At least one certificate is required');
        }

        const certificatesWithFileUrls = await Promise.all(
            certificates.map(async (cert) => {
                const certificateData: DbCertificate = {
                    user_id,
                    title: cert.title,
                    description: cert.description || null,
                    link: cert.url || null,
                    filePath: null,
                    started_at: cert.started_at ? new Date(cert.started_at) : null,
                    end_at: cert.end_at ? new Date(cert.end_at) : null,
                    created_by,
                    updated_by,
                    is_active: true,
                    updated_at: new Date()
                };

                if (cert.file_path) {
                    try {
                        const fileUrl = await uploadCertificateFile(cert.file_path, user_id, cert.title);
                        certificateData.filePath = fileUrl;
                    } catch (uploadError) {
                        console.error('Error uploading certificate file:', uploadError);
                        // Continue without the file if upload fails
                    }
                }

                return certificateData;
            })
        );

        const prismaFormattedData = certificatesWithFileUrls.map(cert => ({
            userId: cert.user_id,
            title: cert.title,
            description: cert.description,
            filePath: cert.filePath,
            link: cert.link,
            startedAt: cert.started_at,
            endAt: cert.end_at,
            isActive: cert.is_active,
            createdBy: cert.created_by,
            updatedBy: cert.updated_by,
            updatedAt: cert.updated_at
        }));

        const createdCertificates = await prisma.userCertificates.createMany({
            data: prismaFormattedData,
            skipDuplicates: false,
        });

        return {
            success: true,
            message: 'Certificates created successfully',
            certificatesAdded: createdCertificates.count,
        };

    } catch (error) {
        const typedError = error as Error;
        console.error('Error creating certificates:', typedError);

        return {
            success: false,
            message: 'Failed to create certificates',
            certificatesAdded: 0,
            error: typedError.message || 'An unexpected error occurred'
        };
    }
}