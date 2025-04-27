import { supabase } from "../../../../../prisma/supabase_client";
import { BUCKETS, PATHS } from "../../../../../prisma/seed";

const BUCKET_NAME = BUCKETS.COF;
const CERTIFICATES_FOLDER = PATHS.CERTIFICATES_FOLDER;

/**
 * Process and store a certificate file in Supabase storage
 */
export async function uploadCertificateFile(fileData: string, userId: string, certificateTitle: string): Promise<string> {
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

        const filePath = `${userId}/${CERTIFICATES_FOLDER}/${fileName}`;

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
export function isAcceptedFileType(fileType: string): boolean {
    const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return acceptedTypes.includes(fileType);
}

/**
 * Get file type from base64 data
 */
export function getFileTypeFromBase64(base64Data: string): string {
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
export function detectFileExtension(base64Data: string): string {
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
export function detectMimeType(base64Data: string): string {
    if (base64Data.includes('data:image/jpeg')) return 'image/jpeg';
    if (base64Data.includes('data:image/png')) return 'image/png';
    if (base64Data.includes('data:application/pdf')) return 'application/pdf';

    return getFileTypeFromBase64(base64Data);
}