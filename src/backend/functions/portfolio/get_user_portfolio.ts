import prisma from "../../../../prisma/client";

export async function getUserPortfolio(userName: string) {
    try {
        const userPortfolio = await prisma.userMaster.findUnique({
            where: {
                userName: userName,
            },
            select: {
                userName: true,
                firstName: true,
                lastName: true,
                email: true,
                description: true,

                // Select skillset with needed fields
                skillset: {
                    select: {
                        skill: {
                            select: {
                                name: true,
                            }
                        },
                        skillLevel: true,
                    },
                    where: {
                        isActive: true,
                    },
                },

                // Select education with needed fields
                education: {
                    select: {
                        eduFrom: true,
                        degree: {
                            select: {
                                name: true,
                            }
                        },
                        startedAt: true,
                        endAt: true,
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
                        title: true,
                        description: true,
                        link: true,
                        startedAt: true,
                        endAt: true,
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
                        title: true,
                        description: true,
                        filePath: true,
                        link: true,
                        startedAt: true,
                        endAt: true,
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
                        title: true,
                        companyName: true,
                        description: true,
                        startedAt: true,
                        endAt: true,
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

        if (!userPortfolio) {
            return { success: false, error: "User not found" };
        }

        return {
            success: true,
            data: userPortfolio,
        };
    } catch (error) {
        console.error("Error fetching user portfolio:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch user portfolio",
        };
    }
}