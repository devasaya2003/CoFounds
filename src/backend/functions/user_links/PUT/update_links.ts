import prisma from "../../../../../prisma/client";

export interface LinkUpdatePayload {
    user_id: string;
    updated_links: {
        id: string;
        link_url: string;
        link_title: string;
    }[];
    new_links: {
        link_url: string;
        link_title: string;
    }[];
    deleted_links: string[];
}

export async function updateUserLinks(payload: LinkUpdatePayload) {
    const now = new Date();
    const userId = payload.user_id;

    if (
        payload.updated_links.length === 0 &&
        payload.new_links.length === 0 &&
        payload.deleted_links.length === 0
    ) {
        return {
            success: true,
            data: {
                updated: 0,
                created: 0,
                deleted: 0,
                total: 0
            }
        };
    }

    const result = await prisma.$transaction(async (tx) => {
        const allPromises = [];
        let updatedCount = 0;
        let createdCount = 0;
        let deletedCount = 0;

        if (payload.updated_links.length > 0) {
            const updatePromises = payload.updated_links.map((link) => {
                return tx.userLinks.update({
                    where: {
                        id: link.id,
                        userId: userId,
                        isActive: true,
                    },
                    data: {
                        linkUrl: link.link_url,
                        linkTitle: link.link_title,
                        updatedBy: userId,
                        updatedAt: now,
                    },
                });
            });
            allPromises.push(Promise.all(updatePromises).then(results => {
                updatedCount = results.length;
                return results;
            }));
        }

        if (payload.new_links.length > 0) {
            for (const link of payload.new_links) {
                const existingLink = await tx.userLinks.findFirst({
                    where: {
                        userId: userId,
                        linkTitle: link.link_title,
                    },
                });

                if (existingLink) {
                    const updatePromise = tx.userLinks.update({
                        where: {
                            id: existingLink.id,
                        },
                        data: {
                            linkUrl: link.link_url, isActive: true,
                            updatedBy: userId,
                            updatedAt: now,
                        },
                    });

                    allPromises.push(updatePromise.then(() => {
                        updatedCount++;
                        return null;
                    }));
                } else {
                    const createPromise = tx.userLinks.create({
                        data: {
                            userId: userId,
                            linkUrl: link.link_url,
                            linkTitle: link.link_title,
                            isActive: true,
                            createdBy: userId,
                            updatedBy: userId,
                        },
                    });

                    allPromises.push(createPromise.then(() => {
                        createdCount++;
                        return null;
                    }));
                }
            }
        }

        if (payload.deleted_links.length > 0) {
            const deletePromises = payload.deleted_links.map((linkId) => {
                return tx.userLinks.update({
                    where: {
                        id: linkId,
                        userId: userId,
                        isActive: true,
                    },
                    data: {
                        isActive: false,
                        updatedBy: userId,
                        updatedAt: now,
                    },
                });
            });
            allPromises.push(Promise.all(deletePromises).then(results => {
                deletedCount = results.length;
                return results;
            }));
        }

        await Promise.all(allPromises);

        return {
            updated: updatedCount,
            created: createdCount,
            deleted: deletedCount,
            total: updatedCount + createdCount + deletedCount,
        };
    });

    return {
        success: true,
        data: result,
    };
}