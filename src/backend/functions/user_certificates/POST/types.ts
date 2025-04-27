export interface DbCertificate {
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

export interface CreateBulkCertificatesRequest {
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

export interface CreateBulkCertificatesResponse {
    success: boolean;
    message: string;
    certificatesAdded: number;
    certificates?: DbCertificate[];
    error?: string;
}