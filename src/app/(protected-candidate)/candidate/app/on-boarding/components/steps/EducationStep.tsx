'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { Alert } from '@/components/ui/alert';
import { Education } from "@/types/candidate_onboarding";
import { EducationStepProps, EducationFieldErrors } from '../types';
import EducationForm from './EducationForm';
import { addEducation, removeEducation, updateEducation } from '@/redux/slices/candidateOnboardingSlice';
import { fetchDegreesPaginated } from '@/redux/masters/degreeMaster';

export default function EducationStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
  onAddEducation,
  onRemoveEducation,
  onUpdateEducation,
  maxEducationEntries = 5,
  isSubmitting = false
}: EducationStepProps) {
  const dispatch = useAppDispatch();
  const [degrees, setDegrees] = useState<{ id: string, name: string }[]>([]);
  const [allDegrees, setAllDegrees] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const educations = watch('education') || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  useEffect(() => {
    async function loadDegrees() {
      try {
        setIsLoading(true);
        const result = await dispatch(fetchDegreesPaginated(1)).unwrap();
        setDegrees(result.degrees);
        setAllDegrees(result.degrees);
        setError(null);
      } catch (err) {
        setError("Failed to load degrees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDegrees();
  }, [dispatch]);

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleAddEducation = () => {

    if (isSubmitting) return;

    if (educations.length < maxEducationEntries) {
      const newEducation: Education = {
        id: generateTempId(),
        institution: '',
        startDate: {
          year: currentYear.toString(),
          month: '01',
          day: '01',
        },
        endDate: {
          year: currentYear.toString(),
          month: '01',
          day: '01',
        },
        currentlyStudying: false,
        degree: '',
      };

      setValue('education', [...educations, newEducation]);
      dispatch(addEducation(newEducation));
      onAddEducation();
    }
  };

  const handleRemoveEducation = (id: string) => {

    if (isSubmitting) return;

    const updatedEducations = educations.filter(edu => edu.id !== id);
    setValue('education', updatedEducations);
    dispatch(removeEducation(id));
    onRemoveEducation(id);
  };

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {

    if (isSubmitting) return;

    const updatedEducations = educations.map(edu =>
      edu.id === id ? { ...edu, ...updates } : edu
    );
    setValue('education', updatedEducations);
    dispatch(updateEducation({ id, updates }));
    onUpdateEducation(id, updates);
  };

  const handleUpdateDegrees = (newDegrees: { id: string, name: string }[]) => {

    if (isSubmitting) return;

    setAllDegrees(newDegrees);
  };

  const selectedDegreeIds = educations
    .map(edu => edu.degree)
    .filter(id => id !== '');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Education</h2>
        <p className="text-gray-600">Add your educational background.</p>
      </div>

      {error && (
        <Alert key="error-alert" variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </Alert>
      )}

      {educations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No education entries yet.</p>
          <button
            type="button"
            onClick={handleAddEducation}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mx-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {educations.map((education, index) => {
            const excludeIds = selectedDegreeIds.filter(id => id !== education.degree);

            return (
              <EducationForm
                key={education.id}
                education={education}
                index={index}
                register={register}
                watch={watch}
                setValue={setValue}
                onRemove={() => handleRemoveEducation(education.id)}
                onUpdate={(updates) => handleUpdateEducation(education.id, updates)}
                years={years}
                months={months}
                days={days}
                errors={errors.education?.[index] as EducationFieldErrors}
                currentlyStudying={education.currentlyStudying}
                onCurrentlyStudyingChange={(checked) => {
                  handleUpdateEducation(education.id, {
                    currentlyStudying: checked,
                    endDate: checked ? null : {
                      year: currentYear.toString(),
                      month: '01',
                      day: '01'
                    }
                  });
                }}
                degrees={allDegrees}
                isLoadingDegrees={isLoading}
                onUpdateDegrees={handleUpdateDegrees}
                excludeDegreeIds={excludeIds}
                disabled={isSubmitting}
              />
            );
          })}

          {educations.length < maxEducationEntries && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddEducation}
                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Another Education ({educations.length}/{maxEducationEntries})
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4 mt-6">
        <button
          type="button"
          className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={onPreviousStep}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous Step
        </button>

        <button
          type="button"
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={onNextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}