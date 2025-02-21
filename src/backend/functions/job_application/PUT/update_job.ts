import { UpdateJob } from "@/backend/interfaces/PUT/update_job";
import prisma from "../../../../../prisma/client";

export const updateJob = async (id: string, data: UpdateJob) => {
    return prisma.jobApplication.update({
        where: {id: id},
        data: {
            ...data.data,
            updatedBy: data.recruiter_id,
            updatedAt: new Date(),
        }
    })
}