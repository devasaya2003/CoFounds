import { UpdateSkill } from "@/backend/interfaces/PUT/update_skill";
import prisma from "../../../../../prisma/client";

export const updateSkill = async (
  id: string,
  data: Partial<UpdateSkill>
) => {
  return prisma.skillMaster.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};
