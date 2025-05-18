import prisma from "../../../../../prisma/client";

export interface UserProfile {
    user_id: string;
    user_name?: string;
    first_name?: string;
    last_name?: string;
    dob?: Date | string;
    description?: string;
    profile_image?: string; // Added profile image field
}

type ProfileUpdateData = {
    userName?: string;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    description?: string;
    profileImage?: string;
    updatedBy: string;
    isActive?: boolean;
    verified?: boolean;
    createdBy?: string;
};

export const createUserProfile = async (data: UserProfile) => {

    const updateData: ProfileUpdateData = {
        updatedBy: data.user_id
    };

    if (data.user_name !== undefined) updateData.userName = data.user_name;
    if (data.first_name !== undefined) updateData.firstName = data.first_name;
    if (data.last_name !== undefined) updateData.lastName = data.last_name;
    if (data.dob !== undefined) updateData.dob = data.dob instanceof Date ? data.dob : new Date(data.dob);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.profile_image !== undefined) updateData.profileImage = data.profile_image; // Handle profile image

    if (data.user_name) {
        updateData.isActive = true;
        updateData.verified = false;
        updateData.createdBy = data.user_id;
    }

    return prisma.userMaster.update({
        where: { id: data.user_id },
        data: updateData,
        select: {
            id: true,
            userName: true,
            firstName: true,
            lastName: true,
            dob: true,
            description: true,
            profileImage: true
        }
    });
}