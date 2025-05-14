import prisma from "../../../../../prisma/client";

interface GetByJobRecruiterId {
    job_id: string;
    recruiter_id: string;
}

export const getByJobRecruiterId = async (data: GetByJobRecruiterId) => {
    const result = await prisma.jobApplication.findUnique({
        where: {
            id: data.job_id,
            recruiterId: data.recruiter_id,
            isActive: true,
        },
        select: {
            id: true,
            recruiterId: true,
            companyId: true,
            title: true,
            jobCode: true,
            requestedBy: true,
            assignmentLink: true,
            location: true,
            package: true,
            jobDescription: true,
            endAt: true,
            createdAt: true,
            updatedAt: true,
            applications: {
                select: {
                    id: true,
                    status: true
                }
            },
            _count: {
                select: {
                    applications: true
                }
            }
        },
    });

    if (!result) return null;

    // Transform the result to have totalApplications instead of _count
    const { _count, ...rest } = result;
    return {
        ...rest,
        totalApplications: _count.applications
    };
};