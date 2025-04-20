import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue, UseFormGetValues, FieldError } from "react-hook-form";
import { SkillWithId, Certificate, ProofOfWork, Project, DateField } from "@/redux/slices/candidateOnboardingSlice";

// Add export keyword to the Education interface
export interface Education {
  id: string;
  institution: string;
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate: {
    year: string;
    month: string;
    day: string;
  } | null;
  currentlyStudying: boolean;
  degree: string;
}

// Add this type for education field errors
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

// Base props for all step components
export interface StepComponentProps {
  errors: FieldErrors<OnboardingFormFields>;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  getValues?: UseFormGetValues<OnboardingFormFields>;
}

// Step 1: Username props
export interface UsernameStepProps extends StepComponentProps {
  formState: { userName: string };
  onNextStep: () => void;
}

// Step 2: Personal Info props
export interface PersonalInfoStepProps {
  formState: {
    firstName: string;
    lastName: string;
    dateOfBirth?: DateField;
    description: string;
    skills: SkillWithId[];
  };
  errors: FieldErrors<OnboardingFormFields>;
  register: UseFormRegister<OnboardingFormFields>;
  watch: UseFormWatch<OnboardingFormFields>;
  setValue: UseFormSetValue<OnboardingFormFields>;
  getValues?: UseFormGetValues<OnboardingFormFields>;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

// Step 3: Education props
export interface EducationStepProps extends StepComponentProps {
  formState: {
    education: Education[];
  };
  onNextStep: () => void;
  onPreviousStep: () => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onUpdateEducation: (id: string, updates: Partial<Education>) => void;
  maxEducationEntries: number;
}

// Education form field for individual education entry
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
  errors?: Record<string, string>;
  currentlyStudying: boolean;
  onCurrentlyStudyingChange: (checked: boolean) => void;
}

// Degree options
export type DegreeOption = {
  value: string;
  label: string;
};

export const DegreeOptions: DegreeOption[] = [
  { value: 'high_school', label: 'High School (10+2)' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'doctorate', label: 'Doctorate or PhD' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'certification', label: 'Professional Certification' },
  { value: 'other', label: 'Other' }
];

// Step 4: Certificates props
export interface CertificatesStepProps extends StepComponentProps {
  formState: {
    certificates: Certificate[];
  };
  onNextStep: () => void;
  onPreviousStep: () => void;
  onAddCertificate: () => void;
  onRemoveCertificate: (id: string) => void;
  onUpdateCertificate: (id: string, updates: Partial<Certificate>) => void;
  maxCertificateEntries: number;
}

export interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  currentFileUrl: string | null;
  currentExternalUrl: string | null;
  error?: string;
  accept: string; // Only .pdf for certificates
}

// Certificate form field for individual certificate entry
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
  errors?: Record<string, string>;
}

// Step 5: Proof of Work props
export interface ProofOfWorkStepProps extends StepComponentProps {
  formState: {
    proofsOfWork: ProofOfWork[];
  };
  onNextStep: () => void;
  onPreviousStep: () => void;
  onAddProofOfWork: () => void;
  onRemoveProofOfWork: (id: string) => void;
  onUpdateProofOfWork: (id: string, updates: Partial<ProofOfWork>) => void;
}

// Proof of Work form field for individual proof entry
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
  errors?: Record<string, string>;
  isCommunityProof: boolean;
  onCommunityProofChange: (checked: boolean) => void;
  currentlyWorking: boolean;
  onCurrentlyWorkingChange: (checked: boolean) => void;
}

// Step 6: Projects props
export interface ProjectsStepProps extends StepComponentProps {
  formState: {
    projects: Project[];
  };
  onNextStep: () => void;
  onPreviousStep: () => void;
  onAddProject: () => void;
  onRemoveProject: (id: string) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

// Project form field for individual project entry
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
  errors?: Record<string, string>;
  currentlyBuilding: boolean;
  onCurrentlyBuildingChange: (checked: boolean) => void;
}

// Reusable date selection component props
export interface DateSelectorProps {
  years: string[];
  months: { value: string; label: string }[];
  days: string[];
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onDayChange: (day: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

// Skill level options
export type SkillLevelOption = {
  value: 'beginner' | 'intermediate' | 'advanced';
  label: string;
};

export const SkillLevelOptions: SkillLevelOption[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

// Helper types for file handling
export type FileUploadResult = {
  fileUrl: string | null;
  error?: string;
};

// Helper types for validation
export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

// Helper types for step navigation
export interface StepNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}