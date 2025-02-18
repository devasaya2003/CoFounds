import { UpdateResource } from "./update_resource";

export interface UpdateBulkResource {
  id: string;
  data: Partial<UpdateResource>;
}