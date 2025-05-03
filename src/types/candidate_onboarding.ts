import { SkillWithLevel } from './shared';

export interface DateField {
  year: string;
  month: string;
  day: string;
}

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
  tempFileId?: string;
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

export interface OnboardingFormFields {  
  userName: string;
    
  firstName: string;
  lastName: string;
  dateOfBirth: DateField;
  description: string;
  skills: SkillWithLevel[];
    
  education: Education[];
    
  certificates: Certificate[];
    
  proofsOfWork: ProofOfWork[];
    
  projects: Project[];
}

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