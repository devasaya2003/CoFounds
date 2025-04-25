import prisma from "../../../../../prisma/client";

export const checkUsernameAvailability = async (userName: string) => {
    const isUser = await prisma.userMaster.findUnique({
        where: {
            userName: userName
        },
    });

    if (isUser) {
        return false;
    }
    
    return true;
}
