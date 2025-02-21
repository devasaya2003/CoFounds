import { CreateSingleJob } from "@/backend/interfaces/POST/create_job";
import prisma from "../../../../../prisma/client";

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