export interface CreateCompany {
    name: string;
    description: string;
    size: number;
    url: string;
    is_active?: boolean;
    created_by?: string;
  }