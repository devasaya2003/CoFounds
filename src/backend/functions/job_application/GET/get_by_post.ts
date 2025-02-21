import { BOTH, COMPANY, RECRUITER } from "@/backend/constants/constants";
import { getByCompanyID } from "./GET_BY_POST_FUNCTIONS/by_company_id";
import { getByRecruiterID } from "./GET_BY_POST_FUNCTIONS/by_recruiter_id";
import { getByCompanyAndRecruiterID } from "./GET_BY_POST_FUNCTIONS/by_company_recruiter_id";

interface GetJobsByPost {
  type: string;
  id: string;
  page_no: number;
  extra_id: Partial<string>;
}

export const getJobsByPost = async (data: GetJobsByPost) => {
  const identifier = data.type;
  switch (identifier) {
    case BOTH:
      getByCompanyAndRecruiterID(data.id, data.extra_id, data.page_no);
      break;
    case COMPANY:
      getByCompanyID(data.id, data.page_no);
      break;
    case RECRUITER:
      getByRecruiterID(data.id, data.page_no);
      break;
    default:
      return "Wrong identifier!";
  }
};
