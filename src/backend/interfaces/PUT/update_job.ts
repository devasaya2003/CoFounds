export interface UpdateJob {
  recruiter_id: string;
  data: Partial<UpdateJobData>;
}

interface UpdateJobData {
  title: string;
  jobDescription: string;
  package: number;
  location: string;
  isActive: boolean;
  assignmentLink: string;
  endAt: Date;
}