import prisma from "../../../../../prisma/client";
import { buildDeleteOperation } from "./operations/delete";
import { buildAddOperation } from "./operations/add";
import { buildUpdateOperation } from "./operations/update";
import { UpdateJobSkills } from "@/backend/interfaces/PUT/update_job_skills";

export const updateJobSkills = async (
  job_id: string,
  payload: UpdateJobSkills
) => {
  const { updatedBy, actions } = payload;
  const operations = [];

  for (const actionDetail of actions) {
    switch (actionDetail.action) {
      case "delete":
        operations.push(buildDeleteOperation(job_id, actionDetail.skillId));
        break;

      case "add":
        operations.push(
          buildAddOperation(
            job_id,
            actionDetail.skillId,
            actionDetail.skillLevel,
            updatedBy
          )
        );
        break;

      case "replace":
        // Replace: delete the old one then add the new skill
        operations.push(buildDeleteOperation(job_id, actionDetail.oldSkillId));
        operations.push(
          buildAddOperation(
            job_id,
            actionDetail.newSkillId,
            actionDetail.skillLevel,
            updatedBy
          )
        );
        break;

      case "update":
        operations.push(
          buildUpdateOperation(
            job_id,
            actionDetail.skillId,
            actionDetail.skillLevel,
            updatedBy
          )
        );
        break;
      default:
        return "Unrecognized operation";
    }
  }

  // Execute all operations atomically
  return await prisma.$transaction(operations);
};
