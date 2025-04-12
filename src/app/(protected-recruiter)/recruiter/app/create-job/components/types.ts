import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue, FieldArrayWithId } from "react-hook-form";
import { JobFormData } from "@/types/job";

export interface JobFormStepProps {
  formData: JobFormData;
  errors: FieldErrors<JobFormData>;
  register: UseFormRegister<JobFormData>;
  watch: UseFormWatch<JobFormData>;
  setValue: UseFormSetValue<JobFormData>;
  handleFieldChange: (fieldPath: string, value: any) => void;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  fields?: FieldArrayWithId<JobFormData, "additionalQuestions", "id">[];
  append?: (value: any) => void;
  remove?: (index: number) => void;
  status?: string;
  removeArrayItem?: (fieldPath: string, index: number) => void;
}