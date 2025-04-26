import { createClient } from '@supabase/supabase-js';
import prisma from "../../../../../prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'user-files';
const CERTIFICATES_FOLDER = 'files/certificates';

interface DbCertificate {
    user_id: string;
    title: string;
    description: string | null;
    filePath: string | null;
    link: string | null;
    started_at: Date | null;
    end_at: Date | null;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    updated_at: Date;
}

interface CreateBulkCertificatesRequest {
    user_id: string;
    created_by: string;
    updated_by: string;
    certificates: Array<{
        title: string;
        description?: string;
        file_path?: string | null;
        url?: string | null;
        started_at?: string | null;
        end_at?: string | null;
    }>;
}

interface CreateBulkCertificatesResponse {
    success: boolean;
    message: string;
    certificatesAdded: number;
    certificates?: DbCertificate[];
    error?: string;
}

/**
 * Process and store a certificate file in Supabase storage
 * @param fileData Base64 encoded file data
 * @param userId User ID for folder organization
 * @param certificateTitle Certificate title for file naming
 * @returns URL of the stored file
 */
async function uploadCertificateFile(fileData: string, userId: string, certificateTitle: string): Promise<string> {
    try {

        const fileType = getFileTypeFromBase64(fileData);
        if (!isAcceptedFileType(fileType)) {
            throw new Error(`Unsupported file type. Only JPG, PNG and PDF files are accepted.`);
        }


        const base64Data = fileData.includes('base64,')
            ? fileData.split('base64,')[1]
            : fileData;


        const buffer = Buffer.from(base64Data, 'base64');


        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (buffer.length > MAX_FILE_SIZE) {
            throw new Error(`File too large. Maximum size is 5 MB.`);
        }


        const fileExt = detectFileExtension(fileData);
        const sanitizedTitle = certificateTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const timestamp = Date.now();
        const fileName = `${sanitizedTitle}_${timestamp}${fileExt}`;


        const filePath = `${CERTIFICATES_FOLDER}/${userId}/${fileName}`;


        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, buffer, {
                contentType: detectMimeType(fileData),
                upsert: true
            });

        if (error) {
            console.error('Error uploading certificate file:', error);
            throw error;
        }


        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Failed to upload certificate file:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to upload certificate file');
    }
}

/**
 * Check if file type is one of the accepted types
 */
function isAcceptedFileType(fileType: string): boolean {
    const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return acceptedTypes.includes(fileType);
}

/**
 * Get file type from base64 data
 */
function getFileTypeFromBase64(base64Data: string): string {
    if (base64Data.includes('data:image/jpeg')) return 'image/jpeg';
    if (base64Data.includes('data:image/png')) return 'image/png';
    if (base64Data.includes('data:application/pdf')) return 'application/pdf';


    const firstChars = base64Data.substring(0, 100);
    if (firstChars.includes('JFIF') || firstChars.includes('/9j/')) return 'image/jpeg';
    if (firstChars.includes('PNG')) return 'image/png';
    if (firstChars.includes('PDF') || firstChars.includes('%PDF')) return 'application/pdf';

    return 'unknown';
}

/**
 * Detect file extension from base64 data
 */
function detectFileExtension(base64Data: string): string {
    if (base64Data.includes('data:image/jpeg')) return '.jpg';
    if (base64Data.includes('data:image/png')) return '.png';
    if (base64Data.includes('data:application/pdf')) return '.pdf';


    const fileType = getFileTypeFromBase64(base64Data);
    if (fileType === 'image/jpeg') return '.jpg';
    if (fileType === 'image/png') return '.png';
    if (fileType === 'application/pdf') return '.pdf';

    throw new Error('Unable to determine file extension. Only JPG, PNG and PDF files are supported.');
}

/**
 * Detect mime type from base64 data
 */
function detectMimeType(base64Data: string): string {
    if (base64Data.includes('data:image/jpeg')) return 'image/jpeg';
    if (base64Data.includes('data:image/png')) return 'image/png';
    if (base64Data.includes('data:application/pdf')) return 'application/pdf';


    return getFileTypeFromBase64(base64Data);
}

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