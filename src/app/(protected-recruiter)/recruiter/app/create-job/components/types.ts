import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SkillWithId } from "@/redux/slices/jobCreationSlice";


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
  location: string;
  requested_by: string;
  package: number;
}


export interface QuestionFieldWithId {
  id: string;
  value: string;
}


export interface JobDetailsStepProps {
  formState: JobFormFields;
  errors: FieldErrors<JobFormFields>;
  register: UseFormRegister<JobFormFields>;
  watch: UseFormWatch<JobFormFields>;
  setValue: UseFormSetValue<JobFormFields>;
  onNextStep: () => void; 
}


export interface AdditionalQuestionsStepProps {
  fields: QuestionFieldWithId[];
  errors: FieldErrors<JobFormFields>;
  register: UseFormRegister<JobFormFields>;
  setValue: UseFormSetValue<JobFormFields>;
  watch: UseFormWatch<JobFormFields>;
  status: string;
}