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

export interface JobFormData {
  jobTitle: string;
  jobCode: string;
  jobDescription: string;
  assignmentLink?: string;
  requiredSkills: string[];
  lastDateToApply: {
    year: string;
    month: string;
    day: string;
  };
  additionalQuestions: {
    question: string;
    type: 'text' | 'multipleChoice';
    options?: string[];
  }[];
}

export const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
  'Python', 'Django', 'Flask', 'Java', 'Spring', 
  'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 
  'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'HTML', 'CSS', 'Sass',
  'TailwindCSS', 'Bootstrap', 'Material UI', 'Git', 'CI/CD'
];