'use client';

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Project } from "@/types/candidate_onboarding";
import { ProjectFieldErrors } from '../types';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { OnboardingFormFields } from '../types';
import DateSelector from '@/components/DateSelector/DateSelector';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';

interface ProjectFormProps {
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

export default function ProjectForm({
  project,
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
}: ProjectFormProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleProjectLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ projectLink: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    onUpdate({ description: value });
    setValue(`projects.${index}.description`, value);
  };

  const handleCurrentlyBuildingChange = (checked: boolean) => {
    onUpdate({
      currentlyBuilding: checked,
      endDate: checked ? null : {
        year: new Date().getFullYear().toString(),
        month: '01',
        day: '01'
      }
    });
    setValue(`projects.${index}.currentlyBuilding`, checked);
    if (checked) {
      setValue(`projects.${index}.endDate`, null);
    } else {
      setValue(`projects.${index}.endDate`, {
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

      <div className="mb-4">
        <Label htmlFor={`projects.${index}.title`} className="mb-1 block py-3">
          Project Title<span className="text-red-500">*</span>
        </Label>
        <Input
          id={`projects.${index}.title`}
          {...register(`projects.${index}.title`, { required: "Title is required" })}
          placeholder="Enter project title"
          value={project.title}
          onChange={handleTitleChange}
          className={errors?.title ? "border-red-500" : ""}
        />
        {errors?.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor={`projects.${index}.projectLink`} className="mb-1 block py-3">
          Project Link (Docs/Demo)
        </Label>
        <Input
          id={`projects.${index}.projectLink`}
          {...register(`projects.${index}.projectLink`)}
          placeholder="https://example.com/your-project"
          value={project.projectLink}
          onChange={handleProjectLinkChange}
          className={errors?.projectLink ? "border-red-500" : ""}
        />
        {errors?.projectLink && (
          <p className="mt-1 text-sm text-red-600">
            {errors.projectLink.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor={`projects.${index}.description`} className="mb-1 block py-3">
          Description<span className="text-red-500">*</span>
        </Label>
        <RichTextEditor
          initialValue={project.description}
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
            selectedYear={project.startDate.year}
            selectedMonth={project.startDate.month}
            selectedDay={project.startDate.day}
            onYearChange={(year) => {
              onUpdate({
                startDate: { ...project.startDate, year }
              });
              setValue(`projects.${index}.startDate.year`, year);
            }}
            onMonthChange={(month) => {
              onUpdate({
                startDate: { ...project.startDate, month }
              });
              setValue(`projects.${index}.startDate.month`, month);
            }}
            onDayChange={(day) => {
              onUpdate({
                startDate: { ...project.startDate, day }
              });
              setValue(`projects.${index}.startDate.day`, day);
            }}
          />
        </div>

        <div>
          <Label className="mb-1 block">
            End Date{!project.currentlyBuilding && <span className="text-red-500">*</span>}
          </Label>
          {project.currentlyBuilding ? (
            <div className="h-10 flex items-center text-gray-500 italic">
              Currently building
            </div>
          ) : (
            <DateSelector
              years={years}
              months={months}
              selectedYear={project.endDate?.year || ""}
              selectedMonth={project.endDate?.month || ""}
              selectedDay={project.endDate?.day || ""}
              onYearChange={(year) => {
                onUpdate({
                  endDate: { ...(project.endDate || { year: "", month: "", day: "" }), year }
                });
                setValue(`projects.${index}.endDate.year`, year);
              }}
              onMonthChange={(month) => {
                onUpdate({
                  endDate: { ...(project.endDate || { year: "", month: "", day: "" }), month }
                });
                setValue(`projects.${index}.endDate.month`, month);
              }}
              onDayChange={(day) => {
                onUpdate({
                  endDate: { ...(project.endDate || { year: "", month: "", day: "" }), day }
                });
                setValue(`projects.${index}.endDate.day`, day);
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <Checkbox
          id={`projects.${index}.currentlyBuilding`}
          checked={project.currentlyBuilding}
          onCheckedChange={handleCurrentlyBuildingChange}
        />
        <Label
          htmlFor={`projects.${index}.currentlyBuilding`}
          className="ml-2 text-sm font-medium"
        >
          I am currently building this project
        </Label>
      </div>
    </div>
  );
}