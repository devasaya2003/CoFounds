import { UpdateRecruiter } from "./update_recruiter";

export interface UpdateBulkRecruiters {
  user_id: string;
  data: Partial<UpdateRecruiter>;
}
