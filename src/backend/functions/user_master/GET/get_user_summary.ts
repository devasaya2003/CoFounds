import prisma from "../../../../../prisma/client";

export async function getUserSummary(id: string) {
    const userBasicInfo = await prisma.userMaster.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            userName: true,
            firstName: true,
            lastName: true,
            dob: true,
            email: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!userBasicInfo) {
        return { success: false, error: "User not found" };
    }

    const [
        skillsetCount,
        educationCount,
        projectsCount,
        certificatesCount,
        experienceCount,
        linksCount
    ] = await Promise.all([
        prisma.userSkillset.count({
            where: {
                userId: id,
                isActive: true,
            },
        }),

        prisma.userEducation.count({
            where: {
                userId: id,
                isActive: true,
            },
        }),

        prisma.userProjects.count({
            where: {
                userId: id,
                isActive: true,
            },
        }),

        prisma.userCertificates.count({
            where: {
                userId: id,
                isActive: true,
            },
        }),

        prisma.userExperience.count({
            where: {
                userId: id,
                isActive: true,
            },
        }),

        prisma.userLinks.count({
            where: {
                userId: id,
                isActive: true,
            },
        }),
    ]);

    return {
        success: true,
        data: {
            ...userBasicInfo,
            counts: {
                skillset: skillsetCount,
                education: educationCount,
                projects: projectsCount,
                certificates: certificatesCount,
                experience: experienceCount,
                links: linksCount,
            },
        },
    };
}