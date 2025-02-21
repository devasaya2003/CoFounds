import prisma from "../../../../../prisma/client";

interface CreateSingleJob {
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

export const createJob = async (data: CreateSingleJob) => {
    return prisma.jobApplication.create({
        data: {
            companyId: data.company_id,
            recruiterId: data.recruiter_id,
            title: data.title,
            jobCode: data.job_code,
            jobDescription: data.job_description,
            package: data.package,
            location: data.location,
            isActive: data.is_active ?? true,
            requestedBy: data.requested_by ?? null,
            assignmentLink: data.assignment_link,
            endAt: data.end_at,
            createdAt: new Date(),
            createdBy: data.created_by ?? null,
        }
    })
}