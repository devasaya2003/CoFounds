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
            _count: {
                select: {
                    applications: true
                }
            }
        },
    });

    if (!result) return null;

    const statusCounts = await prisma.applicationCandidateMap.groupBy({
        by: ['status'],
        where: {
            jobId: data.job_id,
            isActive: true
        },
        _count: {
            status: true
        }
    });

    // Create applicationCount object with the new structure
    const applicationCount = {
        total: result._count.applications,
        applied: 0,
        under_review: 0,
        inprogress: 0,
        rejected: 0,
        closed: 0
    };

    // Fill in the actual counts
    statusCounts.forEach(item => {
        applicationCount[item.status] = item._count.status;
    });

    // Remove _count from the result and add applicationCount
    const { _count, ...rest } = result;
    return {
        ...rest,
        applicationCount
    };
};