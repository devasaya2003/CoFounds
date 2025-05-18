import prisma from "../../../../../prisma/client";

export async function getUserSummary(id: string) {
    try {
        const userSummary = await prisma.userMaster.findUnique({
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
                skillset: {
                    select: {
                        id: true,
                        skill: {
                            select: {
                                id: true,
                                name: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        },
                        skillLevel: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        isActive: true,
                    },
                },

                // Select education with needed fields
                education: {
                    select: {
                        id: true,
                        eduFrom: true,
                        degree: {
                            select: {
                                id: true,
                                name: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        },
                        startedAt: true,
                        endAt: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        endAt: 'desc',
                    },
                },

                // Select projects with needed fields
                projects: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        link: true,
                        startedAt: true,
                        endAt: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        endAt: 'desc',
                    },
                },

                // Select certificates with needed fields
                certificates: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        filePath: true,
                        link: true,
                        startedAt: true,
                        endAt: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        startedAt: 'desc',
                    },
                },

                // Select experiences with needed fields
                experience: {
                    select: {
                        id: true,
                        title: true,
                        companyName: true,
                        description: true,
                        startedAt: true,
                        endAt: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        endAt: 'desc',
                    },
                },
            },
        });

        if (!userSummary) {
            return { success: false, error: "User not found" };
        }

        return {
            success: true,
            data: userSummary,
        };
    } catch (error) {
        console.error("Error fetching user summary:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch user summary",
        };
    }
}