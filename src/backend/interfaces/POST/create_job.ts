export interface CreateSingleJob {
    company_id: string;
    recruiter_id: string;
    title: string;
    job_code: string;
    job_description: string;
    package: number;
    location: string;
    
    is_active?: boolean;
    requested_by?: string;
    assignment_link?: string;
    end_at?: Date;
    created_by?: string;
}