'use client';

import { X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Education } from "@/types/candidate_onboarding";
import { EducationFieldErrors } from '../types';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { OnboardingFormFields } from '../types';
import PaginatedDegreeSelector from '@/components/DegreeSelector/PaginatedDegreeSelector';

interface EducationFormProps {
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
  currentlyStudying: boolean;
  onCurrentlyStudyingChange: (checked: boolean) => void;
  degrees: { id: string; name: string }[];
  isLoadingDegrees: boolean;
  onUpdateDegrees: (updatedDegrees: { id: string; name: string }[]) => void;
  excludeDegreeIds?: string[];
  disabled?: boolean;
}

export default function EducationForm({
  education,
  index,
  register,
  watch,
  setValue,
  onRemove,
  onUpdate,
  years,
  months,
  days,
  errors,
  currentlyStudying,
  onCurrentlyStudyingChange,
  degrees,
  isLoadingDegrees,
  onUpdateDegrees,
  excludeDegreeIds = [],
  disabled = false,
}: EducationFormProps) {
  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onUpdate({ institution: e.target.value });
  };

  const handleDegreeChange = (degreeId: string, degreeName: string) => {
    if (disabled) return;
    onUpdate({ degree: degreeId });
    setValue(`education.${index}.degree`, degreeId);
  };

  const handleClearDegree = () => {
    if (disabled) return;
    onUpdate({ degree: '' });
    setValue(`education.${index}.degree`, '');
  };

  return (
    <div className="p-5 border border-gray-200 rounded-lg relative">
      {/* Allow removal of any education entry including high school */}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className={`absolute top-4 right-4 text-gray-400 hover:text-gray-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-4">
        <Label htmlFor={`education.${index}.institution`} className="mb-1 block py-3">
          Institution<span className="text-red-500">*</span>
        </Label>
        <Input
          id={`education.${index}.institution`}
          {...register(`education.${index}.institution`, { required: "Institution name is required" })}
          placeholder="Enter your school/college name"
          value={education.institution}
          onChange={handleInstitutionChange}
          className={errors?.institution ? "border-red-500" : ""}
          disabled={disabled}
        />
        {errors?.institution && (
          <p className="mt-1 text-sm text-red-600">
            {errors.institution.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor={`education.${index}.degree`} className="mb-1 block py-3">
          Degree<span className="text-red-500">*</span>
        </Label>
        <PaginatedDegreeSelector
          selectedDegree={education.degree}
          onDegreeSelect={handleDegreeChange}
          onClear={handleClearDegree}
          error={errors?.degree?.message}
          isLoading={isLoadingDegrees}
          initialDegrees={degrees}
          excludeDegreeIds={excludeDegreeIds}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
        <div>
          <Label className="mb-1 block">
            Start Date<span className="text-red-500">*</span>
          </Label>
          <DateSelector
            years={years}
            months={months}
            selectedYear={education.startDate.year}
            selectedMonth={education.startDate.month}
            selectedDay={education.startDate.day}
            onYearChange={(year) => {
              if (disabled) return;
              onUpdate({
                startDate: { ...education.startDate, year }
              });
              setValue(`education.${index}.startDate.year`, year);
            }}
            onMonthChange={(month) => {
              if (disabled) return;
              onUpdate({
                startDate: { ...education.startDate, month }
              });
              setValue(`education.${index}.startDate.month`, month);
            }}
            onDayChange={(day) => {
              if (disabled) return;
              onUpdate({
                startDate: { ...education.startDate, day }
              });
              setValue(`education.${index}.startDate.day`, day);
            }}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-1 block">
            End Date{!currentlyStudying && <span className="text-red-500">*</span>}
          </Label>
          {currentlyStudying ? (
            <div className="h-10 flex items-center text-gray-500 italic">
              Currently studying
            </div>
          ) : (
            <DateSelector
              years={years}
              months={months}
              selectedYear={education.endDate?.year || ""}
              selectedMonth={education.endDate?.month || ""}
              selectedDay={education.endDate?.day || ""}
              onYearChange={(year) => {
                if (disabled) return;
                onUpdate({
                  endDate: { ...(education.endDate || { year: "", month: "", day: "" }), year }
                });
                setValue(`education.${index}.endDate.year`, year);
              }}
              onMonthChange={(month) => {
                if (disabled) return;
                onUpdate({
                  endDate: { ...(education.endDate || { year: "", month: "", day: "" }), month }
                });
                setValue(`education.${index}.endDate.month`, month);
              }}
              onDayChange={(day) => {
                if (disabled) return;
                onUpdate({
                  endDate: { ...(education.endDate || { year: "", month: "", day: "" }), day }
                });
                setValue(`education.${index}.endDate.day`, day);
              }}
              disabled={disabled}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <Checkbox
          id={`education.${index}.currentlyStudying`}
          checked={currentlyStudying}
          onCheckedChange={(checked) => {
            if (disabled) return;
            onCurrentlyStudyingChange(checked as boolean);
          }}
          disabled={disabled}
        />
        <Label
          htmlFor={`education.${index}.currentlyStudying`}
          className={`ml-2 text-sm font-medium ${disabled ? 'opacity-70' : ''}`}
        >
          Currently studying here
        </Label>
      </div>
    </div>
  );
}