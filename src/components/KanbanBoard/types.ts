export type ApplicationStatus = 'applied' | 'under_review' | 'inprogress' | 'rejected' | 'closed';

export interface Company {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  assignmentLink: string;
  location: string;
  package: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  assignmentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  job: Job;
}

export interface KanbanColumnProps {
  title: string;
  status: ApplicationStatus;
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onDelete?: (applicationId: string) => void;
}