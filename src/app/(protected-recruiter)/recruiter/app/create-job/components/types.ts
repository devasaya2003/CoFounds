import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SkillWithId } from "@/redux/slices/jobCreationSlice";

// Form fields interface - updated required_skills to handle IDs
export interface JobFormFields {
  title: string;
  job_code: string;
  job_desc: string;
  assignment_link: string;
  required_skills: SkillWithId[]; // Changed from string[] to SkillWithId[]
  last_date_to_apply: {
    year: string;
    month: string;
    day: string;
  };
  additional_questions: string[];
}

// Custom question field with ID
export interface QuestionFieldWithId {
  id: string;
  value: string;
}

// JobDetailsStep props - updated for the new skill structure
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
  onDateChange: (date: { year: string; month: string; day: string }) => void;
  onAddSkill: (skill: SkillWithId) => void;
  onRemoveSkill: (skillId: string) => void;
  goToNextStep: () => void;
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