export interface CreateQuestions {
  job_id: string
  questions: string[];
  created_by: string;
  is_active?: boolean;
}
