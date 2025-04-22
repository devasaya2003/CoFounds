'use client';

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProofOfWork } from '@/types/candidate_onboarding';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { OnboardingFormFields, ProofOfWorkFieldErrors } from '../types';
import DateSelector from '@/components/DateSelector/DateSelector';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';

interface ProofOfWorkFormProps {
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

export default function ProofOfWorkForm({
  proofOfWork,
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
}: ProofOfWorkFormProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ company_name: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    onUpdate({ description: value });
    setValue(`proofsOfWork.${index}.description`, value);
  };

  const handleCommunityWorkChange = (checked: boolean) => {
    onUpdate({ 
      isCommunityWork: checked,
      
      company_name: checked ? 'COF_PROOF_COMMUNITY' : ''
    });
    setValue(`proofsOfWork.${index}.isCommunityWork`, checked);
    setValue(`proofsOfWork.${index}.company_name`, checked ? 'COF_PROOF_COMMUNITY' : '');
  };

  const handleCurrentlyWorkingChange = (checked: boolean) => {
    onUpdate({
      currentlyWorking: checked,
      endDate: checked ? null : {
        year: new Date().getFullYear().toString(),
        month: '01',
        day: '01'
      }
    });
    setValue(`proofsOfWork.${index}.currentlyWorking`, checked);
    if (checked) {
      setValue(`proofsOfWork.${index}.endDate`, null);
    } else {
      setValue(`proofsOfWork.${index}.endDate`, {
        year: new Date().getFullYear().toString(),
        month: '01',
        day: '01'
      });
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-lg relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mt-1 mb-4 flex items-center">
        <Checkbox
          id={`proofsOfWork.${index}.isCommunityWork`}
          checked={proofOfWork.isCommunityWork}
          onCheckedChange={handleCommunityWorkChange}
        />
        <Label
          htmlFor={`proofsOfWork.${index}.isCommunityWork`}
          className="ml-2 text-sm font-medium"
        >
          This is community work (public speaking, workshops, etc.)
        </Label>
      </div>

      <div className="mb-4">
        <Label htmlFor={`proofsOfWork.${index}.title`} className="mb-1 block py-3">
          Title<span className="text-red-500">*</span>
        </Label>
        <Input
          id={`proofsOfWork.${index}.title`}
          {...register(`proofsOfWork.${index}.title`, { required: "Title is required" })}
          placeholder="Enter work title"
          value={proofOfWork.title}
          onChange={handleTitleChange}
          className={errors?.title ? "border-red-500" : ""}
        />
        {errors?.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Only show company name field if not community work */}
      {!proofOfWork.isCommunityWork && (
        <div className="mb-4">
          <Label htmlFor={`proofsOfWork.${index}.company_name`} className="mb-1 block py-3">
            Company Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`proofsOfWork.${index}.company_name`}
            {...register(`proofsOfWork.${index}.company_name`, { required: "Company name is required" })}
            placeholder="Enter company name"
            value={proofOfWork.company_name}
            onChange={handleCompanyNameChange}
            className={errors?.company_name ? "border-red-500" : ""}
          />
          {errors?.company_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.company_name.message}
            </p>
          )}
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor={`proofsOfWork.${index}.description`} className="mb-1 block py-3">
          Description<span className="text-red-500">*</span>
        </Label>
        <RichTextEditor
          initialValue={proofOfWork.description}
          onChange={handleDescriptionChange}
        />
        {errors?.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
        <div>
          <Label className="mb-1 block">
            Start Date<span className="text-red-500">*</span>
          </Label>
          <DateSelector
            years={years}
            months={months}
            selectedYear={proofOfWork.startDate.year}
            selectedMonth={proofOfWork.startDate.month}
            selectedDay={proofOfWork.startDate.day}
            onYearChange={(year) => {
              onUpdate({
                startDate: { ...proofOfWork.startDate, year }
              });
              setValue(`proofsOfWork.${index}.startDate.year`, year);
            }}
            onMonthChange={(month) => {
              onUpdate({
                startDate: { ...proofOfWork.startDate, month }
              });
              setValue(`proofsOfWork.${index}.startDate.month`, month);
            }}
            onDayChange={(day) => {
              onUpdate({
                startDate: { ...proofOfWork.startDate, day }
              });
              setValue(`proofsOfWork.${index}.startDate.day`, day);
            }}
          />
        </div>

        <div>
          <Label className="mb-1 block">
            End Date{!proofOfWork.currentlyWorking && <span className="text-red-500">*</span>}
          </Label>
          {proofOfWork.currentlyWorking ? (
            <div className="h-10 flex items-center text-gray-500 italic">
              Currently working
            </div>
          ) : (
            <DateSelector
              years={years}
              months={months}
              selectedYear={proofOfWork.endDate?.year || ""}
              selectedMonth={proofOfWork.endDate?.month || ""}
              selectedDay={proofOfWork.endDate?.day || ""}
              onYearChange={(year) => {
                onUpdate({
                  endDate: { ...(proofOfWork.endDate || { year: "", month: "", day: "" }), year }
                });
                setValue(`proofsOfWork.${index}.endDate.year`, year);
              }}
              onMonthChange={(month) => {
                onUpdate({
                  endDate: { ...(proofOfWork.endDate || { year: "", month: "", day: "" }), month }
                });
                setValue(`proofsOfWork.${index}.endDate.month`, month);
              }}
              onDayChange={(day) => {
                onUpdate({
                  endDate: { ...(proofOfWork.endDate || { year: "", month: "", day: "" }), day }
                });
                setValue(`proofsOfWork.${index}.endDate.day`, day);
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <Checkbox
          id={`proofsOfWork.${index}.currentlyWorking`}
          checked={proofOfWork.currentlyWorking}
          onCheckedChange={handleCurrentlyWorkingChange}
        />
        <Label
          htmlFor={`proofsOfWork.${index}.currentlyWorking`}
          className="ml-2 text-sm font-medium"
        >
          I am currently working on this
        </Label>
      </div>
    </div>
  );
}