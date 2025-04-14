import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SkillWithId } from "@/redux/slices/jobCreationSlice";

// Form fields interface - updated to include new fields
export interface JobFormFields {
  title: string;
  job_code: string;
  job_desc: string;
  assignment_link: string;
  required_skills: SkillWithId[];
  last_date_to_apply: {
    year: string;
    month: string;
    day: string;
  };
  additional_questions: string[];
  location: string; // Added new field
  requested_by: string; // Added new field 
  package: number; // Added new field
}

// Custom question field with ID
export interface QuestionFieldWithId {
  id: string;
  value: string;
}

// JobDetailsStep props - updated for the new fields
export interface JobDetailsStepProps {
  formState: JobFormFields;
  errors: FieldErrors<JobFormFields>;
  register: UseFormRegister<JobFormFields>;
  watch: UseFormWatch<JobFormFields>;
  setValue: UseFormSetValue<JobFormFields>;
  onTitleChange: (value: string) => void;
  onJobCodeChange: (value: string) => void;
  onJobDescChange: (value: string) => void;
  onAssignmentLinkChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onRequestedByChange: (value: string) => void;
  onPackageChange: (value: number) => void;
  onDateChange: (date: { year: string; month: string; day: string }) => void;
  onAddSkill: (skill: SkillWithId) => void;
  onRemoveSkill: (skillId: string) => void;
  goToNextStep: () => void;
  onSkillLevelChange: (skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => void;
}

// AdditionalQuestionsStep props remain the same
export interface AdditionalQuestionsStepProps {
  questions: string[];
  errors: FieldErrors<JobFormFields>;
  register: UseFormRegister<JobFormFields>;
  setValue: UseFormSetValue<JobFormFields>;
  fields: QuestionFieldWithId[];
  append: (value: string) => void;
  remove: (index: number) => void;
  onQuestionChange: (index: number, value: string) => void;
  status: string;
  goToPreviousStep: () => void;
}