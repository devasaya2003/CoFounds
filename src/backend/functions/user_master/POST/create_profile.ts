import prisma from "../../../../../prisma/client";

export interface UserProfile {
    user_id: string;
    user_name: string;
    first_name: string;
    last_name: string;
    dob: Date;
    description: string;
}

export const createUserProfile = async (data: UserProfile) => {
    return prisma.userMaster.update({
        where: { id: data.user_id },
        data: {
            userName: data.user_name,
            firstName: data.first_name,
            lastName: data.last_name,
            dob: data.dob,
            description: data.description,
            isActive: true,
            verified: false,
            createdBy: data.user_id,
            updatedBy: data.user_id
        },
        select: {
            id: true,
            userName: true,
            firstName: true,
            lastName: true,
            dob: true,
            description: true
        }
    });
}