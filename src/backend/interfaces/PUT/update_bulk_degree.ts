import { UpdateDegree } from "./update_degree";

export interface UpdateBulkDegree {
    id: string;
    data: Partial<UpdateDegree>;
}