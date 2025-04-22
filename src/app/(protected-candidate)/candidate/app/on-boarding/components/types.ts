import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue, UseFormGetValues, FieldError } from "react-hook-form";
import {
  SkillWithId,
  Education, 
  Certificate, 
  ProofOfWork,
  Project,
  DateField
} from "@/types/candidate_onboarding";

// Form fields interface
export interface OnboardingFormFields {
  // Step 1
  userName: string;
  
  // Step 2
  firstName: string;
  lastName: string;
  dateOfBirth: DateField;
  description: string;
  skills: SkillWithId[];
  
  // Step 3
  education: Education[];
  
  // Step 4
  certificates: Certificate[];
  
  // Step 5
  proofsOfWork: ProofOfWork[];
  
  // Step 6
  projects: Project[];
}

// Base props interface for all step components
export interface BaseStepProps {
  errors: FieldErrors<OnboardingFormFields>;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  onNextStep: () => void;
  onPreviousStep?: () => void;
}

// Username step props (Step 1)
export interface UsernameStepProps extends BaseStepProps {
  formState: {
    userName: string;
  };
}

// Personal info step props (Step 2)
export interface PersonalInfoStepProps extends BaseStepProps {
  formState: {
    firstName: string;
    lastName: string;
    description: string;
    skills: SkillWithId[];
    dateOfBirth?: DateField; // Add dateOfBirth property
  };
}

// Education step props (Step 3)
export interface EducationStepProps extends BaseStepProps {
  formState: {
    education: Education[];
  };
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onUpdateEducation: (id: string, updates: Partial<Education>) => void;
  maxEducationEntries?: number;
}

// Certificate step props (Step 4)
export interface CertificatesStepProps extends BaseStepProps {
  formState: {
    certificates: Certificate[];
  };
  onAddCertificate: () => void;
  onRemoveCertificate: (id: string) => void;
  onUpdateCertificate: (id: string, updates: Partial<Certificate>) => void;
  maxCertificateEntries?: number;
}

// Proof of work step props (Step 5)
export interface ProofOfWorkStepProps extends BaseStepProps {
  formState: {
    proofsOfWork: ProofOfWork[];
  };
  onAddProofOfWork: () => void;
  onRemoveProofOfWork: (id: string) => void;
  onUpdateProofOfWork: (id: string, updates: Partial<ProofOfWork>) => void;
}

// Project step props (Step 6)
export interface ProjectStepProps extends BaseStepProps {
  formState: {
    projects: Project[];
  };
  onAddProject: () => void;
  onRemoveProject: (id: string) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

// Form component props
export interface CertificateFormProps {
  certificate: Certificate;
  index: number;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  onRemove: () => void;
  onUpdate: (updates: Partial<Certificate>) => void;
  years: string[];
  months: { value: string; label: string }[];
  days: string[];
  errors?: CertificateFieldErrors;
}

export interface EducationFormProps {
  education: Education;
  index: number;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  onRemove: () => void;
  onUpdate: (updates: Partial<Education>) => void;
  years: string[];
  months: { value: string; label: string }[];
  days: string[];
  errors?: EducationFieldErrors;
}

export interface ProofOfWorkFormProps {
  proofOfWork: ProofOfWork;
  index: number;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  onRemove: () => void;
  onUpdate: (updates: Partial<ProofOfWork>) => void;
  years: string[];
  months: { value: string; label: string }[];
  days: string[];
  errors?: ProofOfWorkFieldErrors;
}

export interface ProjectFormProps {
  project: Project;
  index: number;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  onRemove: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  years: string[];
  months: { value: string; label: string }[];
  days: string[];
  errors?: ProjectFieldErrors;
}

// Field error types remain the same
export type EducationFieldErrors = {
  institution?: FieldError;
  degree?: FieldError;
  startDate?: {
    year?: FieldError;
    month?: FieldError;
    day?: FieldError;
  };
  endDate?: {
    year?: FieldError;
    month?: FieldError;
    day?: FieldError;
  };
  currentlyStudying?: FieldError;
  [key: string]: FieldError | Record<string, FieldError> | undefined;
};

export interface CertificateFieldErrors {
  title?: { message: string };
  description?: { message: string };
  startDate?: { 
    year?: { message: string };
    month?: { message: string };
    day?: { message: string };
  };
  endDate?: { 
    year?: { message: string };
    month?: { message: string };
    day?: { message: string };
  };
  fileUrl?: { message: string };
  externalUrl?: { message: string };
}

export interface ProofOfWorkFieldErrors {
  title?: { message: string };
  company_name?: { message: string };
  description?: { message: string };
  startDate?: { 
    year?: { message: string };
    month?: { message: string };
    day?: { message: string };
  };
  endDate?: { 
    year?: { message: string };
    month?: { message: string };
    day?: { message: string };
  };
}

export interface ProjectFieldErrors {
  title?: FieldError;
  projectLink?: FieldError;
  description?: FieldError;
  startDate?: { 
    year?: FieldError;
    month?: FieldError;
    day?: FieldError;
  };
  endDate?: { 
    year?: FieldError;
    month?: FieldError;
    day?: FieldError;
  };
  currentlyBuilding?: FieldError;
}