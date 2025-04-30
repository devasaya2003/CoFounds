'use client';

import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Label } from '@/components/ui/label';
import { PersonalInfoStepProps } from '../types';
import { SkillWithLevel } from '@/types/shared';
import { 
  setFirstName,
  setLastName,
  setDescription,
  setDateOfBirth,
  addSkill,
  removeSkill,
  updateSkillLevel
} from '@/redux/slices/candidateOnboardingSlice';
import { useState, useEffect } from 'react';

export default function PersonalInfoStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
  isSubmitting 
}: PersonalInfoStepProps) {
  const dispatch = useAppDispatch();
  const selectedSkills = watch('skills') || [];
  
  const currentYear = new Date().getFullYear();
  
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - 100 + i).toString());
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
    
    if (isSubmitting) return;
    
    setValue('description', html);
    dispatch(setDescription(html));
  };
  
  useEffect(() => {
    if (formState.dateOfBirth) {
      setValue('dateOfBirth.year', formState.dateOfBirth.year || '');
      setValue('dateOfBirth.month', formState.dateOfBirth.month || '');
      setValue('dateOfBirth.day', formState.dateOfBirth.day || '');
    }
  }, [formState.dateOfBirth, setValue]);
  
  const handleDOBChange = (field: 'year' | 'month' | 'day', value: string) => {
    
    if (isSubmitting) return;
    
    const updatedDOB = {
      year: field === 'year' ? value : dobYear,
      month: field === 'month' ? value : dobMonth,
      day: field === 'day' ? value : dobDay
    };
    setValue(`dateOfBirth.${field}`, value);
    dispatch(setDateOfBirth(updatedDOB));
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
          onChange={(e) => dispatch(setFirstName(e.target.value))}
          disabled={isSubmitting} 
        />
        
        <FormInput
          id="lastName"
          label="Last Name"
          required
          type="text"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
          onChange={(e) => dispatch(setLastName(e.target.value))}
          disabled={isSubmitting} 
        />
      </div>

      {/* Date of Birth Field */}
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
          disabled={isSubmitting} 
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      <div className='py-2'>
        <label className="block text-sm font-medium text-gray-700">
          Skills<span className="text-red-500 ml-1">*</span>
        </label>
        <PaginatedSkillsSelector
          selectedSkills={selectedSkills}
          onSkillSelect={(skill: SkillWithLevel) => {
            
            if (isSubmitting) return;
            
            const updatedSkills = [...selectedSkills, skill];
            setValue('skills', updatedSkills);
            dispatch(addSkill(skill));
          }}
          onSkillRemove={(skillId: string) => {
            if (isSubmitting) return;
            
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
            setValue('skills', updatedSkills);
            dispatch(removeSkill(skillId));
          }}
          onSkillLevelChange={(skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
            if (isSubmitting) return;
            
            const updatedSkills = selectedSkills.map(skill => 
              skill.id === skillId ? { ...skill, level } : skill
            );
            setValue('skills', updatedSkills);
            dispatch(updateSkillLevel({ skillId, level }));
          }}
          error={errors.skills?.message}
          disabled={isSubmitting} 
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
          disabled={isSubmitting} 
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description.message}
          </p>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPreviousStep}
          disabled={isSubmitting} 
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous Step
        </button>
        
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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