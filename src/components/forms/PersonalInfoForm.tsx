'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Label } from '@/components/ui/label';
import { SkillWithLevel } from '@/types/shared';
import { DateField } from '@/types/candidate_onboarding';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  description: string;
  skills: SkillWithLevel[];
  dateOfBirth?: DateField;
}

export interface PersonalInfoFormProps {
  formState: PersonalInfoFormData;
  errors: any;
  register: any;
  watch: any;
  setValue: any;
  onFirstNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  onDescriptionChange?: (html: string) => void;
  onSkillAdd?: (skill: SkillWithLevel) => void;
  onSkillRemove?: (skillId: string) => void;
  onSkillLevelChange?: (skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => void;
  onDateOfBirthChange?: (field: 'year' | 'month' | 'day', value: string) => void;
  disabled?: boolean;
  showNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  isSubmitting?: boolean;
  fetchAllSkills?: boolean;
  navigationLabel?: {
    next?: string;
    previous?: string;
  };
}

export default function PersonalInfoForm({
  formState,
  errors,
  register,
  watch,
  setValue,
  onFirstNameChange,
  onLastNameChange,
  onDescriptionChange,
  onSkillAdd,
  onSkillRemove,
  onSkillLevelChange,
  onDateOfBirthChange,
  disabled = false,
  showNavigation = true,
  onNext,
  onPrevious,
  isSubmitting = false,
  fetchAllSkills = false,
  navigationLabel = { next: 'Next Step', previous: 'Previous Step' }
}: PersonalInfoFormProps) {
  const selectedSkills = watch('skills') || [];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => (currentYear - 100 + i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  
  const dobYear = watch('dateOfBirth.year') || '';
  const dobMonth = watch('dateOfBirth.month') || '';
  const dobDay = watch('dateOfBirth.day') || '';
  
  const handleEditorChange = (html: string) => {
    if (disabled || isSubmitting) return;
    
    setValue('description', html);
    if (onDescriptionChange) {
      onDescriptionChange(html);
    }
  };
  
  const handleDOBChange = (field: 'year' | 'month' | 'day', value: string) => {
    if (disabled || isSubmitting) return;
    
    setValue(`dateOfBirth.${field}`, value);
    if (onDateOfBirthChange) {
      onDateOfBirthChange(field, value);
    }
  };
  
  return (
    <div className="space-y-1">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p className="text-gray-600">Tell us a bit about yourself to help create your profile.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        <FormInput
          id="firstName"
          label="First Name"
          required
          type="text"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'First name is required' })}
          onChange={(e) => onFirstNameChange && onFirstNameChange(e.target.value)}
          disabled={disabled || isSubmitting} 
        />
        
        <FormInput
          id="lastName"
          label="Last Name"
          required
          type="text"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
          onChange={(e) => onLastNameChange && onLastNameChange(e.target.value)}
          disabled={disabled || isSubmitting} 
        />
      </div>

      {/* Date of Birth Field - only show if needed */}
      {formState.dateOfBirth !== undefined && (
        <div className="py-2">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth<span className="text-red-500 ml-1">*</span>
          </Label>
          <DateSelector
            years={years}
            months={months}
            selectedYear={dobYear}
            selectedMonth={dobMonth}
            selectedDay={dobDay}
            onYearChange={(year) => handleDOBChange('year', year)}
            onMonthChange={(month) => handleDOBChange('month', month)}
            onDayChange={(day) => handleDOBChange('day', day)}
            error={errors.dateOfBirth?.message}
            disabled={disabled || isSubmitting}
            />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      )}

      <div className='py-2'>
        <label className="block text-sm font-medium text-gray-700">
          Skills<span className="text-red-500 ml-1">*</span>
        </label>
        <PaginatedSkillsSelector
          selectedSkills={selectedSkills}
          onSkillSelect={(skill: SkillWithLevel) => {
            if (disabled || isSubmitting) return;
            
            const updatedSkills = [...selectedSkills, skill];
            setValue('skills', updatedSkills);
            if (onSkillAdd) {
              onSkillAdd(skill);
            }
          }}
          onSkillRemove={(skillId: string) => {
            if (disabled || isSubmitting) return;
            
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
            setValue('skills', updatedSkills);
            if (onSkillRemove) {
              onSkillRemove(skillId);
            }
          }}
          onSkillLevelChange={(skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
            if (disabled || isSubmitting) return;
            
            const updatedSkills = selectedSkills.map(skill => 
              skill.id === skillId ? { ...skill, level } : skill
            );
            setValue('skills', updatedSkills);
            if (onSkillLevelChange) {
              onSkillLevelChange(skillId, level);
            }
          }}
          error={errors.skills?.message}
          disabled={disabled || isSubmitting}
          fetchAll={fetchAllSkills}
        />
      </div>
      
      <div className='py-2'>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            About Me<span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        <RichTextEditor 
          initialValue={formState.description}
          onChange={handleEditorChange}
          disabled={disabled || isSubmitting} 
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description.message}
          </p>
        )}
      </div>
      
      {/* Navigation buttons - only show if navigation is enabled */}
      {showNavigation && (
        <div className="flex justify-between pt-4">
          {onPrevious && (
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onPrevious}
              disabled={disabled || isSubmitting} 
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {navigationLabel.previous}
            </button>
          )}
          
          {onNext && (
            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onNext}
              disabled={disabled || isSubmitting} 
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  {navigationLabel.next}
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}