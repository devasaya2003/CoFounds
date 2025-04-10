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
  assignmentLink?: string;
  location?: string;
  package?: string;
  jobDescription?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    url?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  recruiter: {
    id: string;
    email: string;
    userName: string;
    firstName: string; // Add firstName
    lastName: string;  // Add lastName
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  statusCounts: {
    applied: number;
    under_review: number;
    inprogress: number;
    rejected: number;
    closed: number;
  };
}