import prisma from "../../../../../prisma/client";

export const getUserDetails = async (id: string) => {
    return prisma.userMaster.findUnique({
        where: {id: id},
        select: {
            id: true,
            email: true,
            userName: true,
            firstName: true,
            lastName: true,
            phone: true,
            dob: true,
            description: true,
            verified: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        }
    })
}