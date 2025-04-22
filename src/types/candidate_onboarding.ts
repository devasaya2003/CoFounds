import { SkillWithLevel } from './shared';

// Core data models for candidate onboarding
export interface DateField {
  year: string;
  month: string;
  day: string;
}

// Reference the shared skill type
export interface SkillWithId extends SkillWithLevel {}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: DateField;
  endDate: DateField | null;
  currentlyStudying: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  startDate: DateField;
  endDate: DateField | null;
  fileUrl?: string;
  externalUrl?: string;
}

export interface ProofOfWork {
  id: string;
  title: string;
  company_name: string;
  description: string;
  startDate: DateField;
  endDate: DateField | null;
  isCommunityWork: boolean;
  currentlyWorking: boolean;
}

export interface Project {
  id: string;
  title: string;
  projectLink: string;
  description: string;
  startDate: DateField;
  endDate: DateField | null;
  currentlyBuilding: boolean;
}

// Form field definitions
export interface OnboardingFormFields {
  // Step 1
  userName: string;
  
  // Step 2
  firstName: string;
  lastName: string;
  dateOfBirth: DateField;
  description: string;
  skills: SkillWithLevel[];
  
  // Step 3
  education: Education[];
  
  // Step 4
  certificates: Certificate[];
  
  // Step 5
  proofsOfWork: ProofOfWork[];
  
  // Step 6
  projects: Project[];
}

// Constants
export const DegreeOptions = [
  { value: 'high_school', label: 'High School (10+2)' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'doctorate', label: 'Doctorate or PhD' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'certification', label: 'Professional Certification' },
  { value: 'other', label: 'Other' }
];

export const SkillLevelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];