type DELETE = { action: "delete"; skillId: string };
type ADD = { action: "add"; skillId: string; skillLevel: string };
type REPLACE = {
  action: "replace";
  oldSkillId: string;
  newSkillId: string;
  skillLevel: string;
};
type UPDATE = { action: "update"; skillId: string; skillLevel: string };

type UpdateSkillAction = DELETE | ADD | REPLACE | UPDATE;

export interface UpdateJobSkills {
  updatedBy: string | null;
  actions: UpdateSkillAction[];
}
