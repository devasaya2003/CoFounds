import { UpdateSkill } from "./update_skill";

export interface UpdateBulkSkill {
    id: string;
    data: Partial<UpdateSkill>;
}