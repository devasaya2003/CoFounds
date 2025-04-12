import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue, FieldArrayWithId } from "react-hook-form";
import { JobFormData } from "@/types/job";

// Base props for all form steps
export interface BaseFormStepProps {
  formData: JobFormData;
  errors: FieldErrors<JobFormData>;
  register: UseFormRegister<JobFormData>;
  watch: UseFormWatch<JobFormData>;
  setValue: UseFormSetValue<JobFormData>;
  handleFieldChange: (fieldPath: string, value: unknown) => void;
}

// Props specific to JobDetailsStep
export interface JobDetailsStepProps extends BaseFormStepProps {
  goToNextStep: () => void;
}

// Props specific to AdditionalQuestionsStep
export interface AdditionalQuestionsStepProps extends BaseFormStepProps {
  goToPreviousStep: () => void;
  fields: FieldArrayWithId<JobFormData, "additionalQuestions", "id">[];
  append: (value: Record<string, unknown>) => void;
  remove: (index: number) => void;
  status: string;
  removeArrayItem: (fieldPath: string, index: number) => void;
}

// Combined props type with optional step-specific properties
export type JobFormStepProps = BaseFormStepProps & {
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  fields?: FieldArrayWithId<JobFormData, "additionalQuestions", "id">[];
  append?: (value: Record<string, unknown>) => void;
  remove?: (index: number) => void;
  status?: string;
  removeArrayItem?: (fieldPath: string, index: number) => void;
};