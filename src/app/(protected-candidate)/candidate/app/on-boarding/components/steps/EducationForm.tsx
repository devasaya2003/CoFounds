'use client';

import { X, AlertCircle, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Education, EducationFieldErrors } from '../types';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { OnboardingFormFields } from '../types';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { fetchDegreesPaginated } from '@/redux/masters/degreeMaster';

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
  errors?: EducationFieldErrors; // Use specific type instead of any
  currentlyStudying: boolean;
  onCurrentlyStudyingChange: (checked: boolean) => void;
  degrees: { id: string; name: string }[];
  isLoadingDegrees: boolean;
  onUpdateDegrees: (updatedDegrees: { id: string; name: string }[]) => void;
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
  onUpdateDegrees
}: EducationFormProps) {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ institution: e.target.value });
  };

  const handleDegreeChange = (value: string) => {
    onUpdate({ degree: value });
    setValue(`education.${index}.degree`, value);
  };

  const handleLoadMoreDegrees = async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const result = await dispatch(fetchDegreesPaginated(nextPage)).unwrap();

      if (!result.degrees.length || result.degrees.length < 10) {
        setHasMore(false);
      }

      setCurrentPage(nextPage);
      onUpdateDegrees([...degrees, ...result.degrees]);
    } catch (err) {
      console.error("Error loading more degrees:", err);
    } finally {
      setIsLoadingMore(false);
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
        <Label htmlFor={`education.${index}.institution`} className="mb-1 block">
          Institution<span className="text-red-500">*</span>
        </Label>
        <Input
          id={`education.${index}.institution`}
          {...register(`education.${index}.institution`, { required: "Institution name is required" })}
          placeholder="Enter your school/college name"
          value={education.institution}
          onChange={handleInstitutionChange}
          className={errors?.institution ? "border-red-500" : ""}
        />
        {errors?.institution && (
          <p className="mt-1 text-sm text-red-600">
            {errors.institution.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor={`education.${index}.degree`} className="mb-1 block">
          Degree<span className="text-red-500">*</span>
        </Label>
        <Select
          value={education.degree}
          onValueChange={handleDegreeChange}
          disabled={isLoadingDegrees}
        >
          <SelectTrigger
            id={`education.${index}.degree`}
            className={errors?.degree ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select a degree" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {isLoadingDegrees && currentPage === 1 ? (
              <SelectItem value="loading" disabled>
                Loading degrees...
              </SelectItem>
            ) : (
              <>
                <SelectItem value="high_school">High School (10+2)</SelectItem>
                {degrees.map(degree => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name}
                  </SelectItem>
                ))}

                {hasMore && (
                  <div className="py-2 px-2 border-t border-gray-100">
                    <button
                      type="button"
                      className="w-full text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLoadMoreDegrees();
                      }}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Load more <ChevronDown className="ml-1 h-3 w-3" />
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </SelectContent>
        </Select>
        {errors?.degree && (
          <p className="mt-1 text-sm text-red-600">
            {errors.degree.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block">
            Start Date<span className="text-red-500">*</span>
          </Label>
          <DateSelector
            years={years}
            months={months}
            days={days}
            selectedYear={education.startDate.year}
            selectedMonth={education.startDate.month}
            selectedDay={education.startDate.day}
            onYearChange={(year) => {
              onUpdate({
                startDate: { ...education.startDate, year }
              });
              setValue(`education.${index}.startDate.year`, year);
            }}
            onMonthChange={(month) => {
              onUpdate({
                startDate: { ...education.startDate, month }
              });
              setValue(`education.${index}.startDate.month`, month);
            }}
            onDayChange={(day) => {
              onUpdate({
                startDate: { ...education.startDate, day }
              });
              setValue(`education.${index}.startDate.day`, day);
            }}
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
              days={days}
              selectedYear={education.endDate?.year || ""}
              selectedMonth={education.endDate?.month || ""}
              selectedDay={education.endDate?.day || ""}
              onYearChange={(year) => {
                onUpdate({
                  endDate: { ...(education.endDate || { year: "", month: "", day: "" }), year }
                });
                setValue(`education.${index}.endDate.year`, year);
              }}
              onMonthChange={(month) => {
                onUpdate({
                  endDate: { ...(education.endDate || { year: "", month: "", day: "" }), month }
                });
                setValue(`education.${index}.endDate.month`, month);
              }}
              onDayChange={(day) => {
                onUpdate({
                  endDate: { ...(education.endDate || { year: "", month: "", day: "" }), day }
                });
                setValue(`education.${index}.endDate.day`, day);
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <Checkbox
          id={`education.${index}.currentlyStudying`}
          checked={currentlyStudying}
          onCheckedChange={onCurrentlyStudyingChange}
        />
        <Label
          htmlFor={`education.${index}.currentlyStudying`}
          className="ml-2 text-sm font-medium"
        >
          Currently studying here
        </Label>
      </div>
    </div>
  );
}