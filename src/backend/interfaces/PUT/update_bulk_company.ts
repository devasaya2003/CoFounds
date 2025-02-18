import { UpdateCompany } from "./update_company";

export interface UpdateBulkCompany {
    id: string;
    data: Partial<UpdateCompany>;
  }