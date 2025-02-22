import { BOTH, COMPANY, RECRUITER } from "@/backend/constants/constants";
import { getByCompanyID } from "./GET_BY_POST_FUNCTIONS/by_company_id";
import { getByRecruiterID } from "./GET_BY_POST_FUNCTIONS/by_recruiter_id";
import { getByCompanyAndRecruiterID } from "./GET_BY_POST_FUNCTIONS/by_company_recruiter_id";

interface GetJobsByPost {
  type: string;
  id: string; // company-id or recruiter-id
  page_no: number;
  extra_id: Partial<string>; // only when company-id and recruiter-id both required. This will always be recruiter-id
}

export const getJobsByPost = async (data: GetJobsByPost) => {
  const identifier = data.type;
  switch (identifier) {
    case BOTH:
      return await getByCompanyAndRecruiterID(data.id, data.extra_id, data.page_no);
    case COMPANY:
      return await getByCompanyID(data.id, data.page_no);
    case RECRUITER:
      return await getByRecruiterID(data.id, data.page_no);
    default:
      return "Wrong identifier!";
  }
};
