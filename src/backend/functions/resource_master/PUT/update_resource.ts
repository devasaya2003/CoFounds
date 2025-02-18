import { UpdateResource } from "@/backend/interfaces/PUT/update_resource";
import prisma from "../../../../../prisma/client";

export const updateResource = async (id: string, data: Partial<UpdateResource>) => {
    return prisma.resourceMaster.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  };