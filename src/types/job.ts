export interface JobStatus {
  applied: number;
  under_review: number;
  inprogress: number;
  rejected: number;
  closed: number;
}

export interface Company {
  id: string;
  name: string;
  url: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Recruiter {
  id: string;
  email: string;
  userName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  jobCode: string;
  requestedBy: string;
  assignmentLink: string;
  location: string;
  package: string;
  jobDescription: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
  recruiter: Recruiter;
  statusCounts: JobStatus;
}