'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import DateSelector from '@/components/DateSelector/DateSelector';
import SkillsSelector from '@/components/SkillsSelector/SkillsSelector';
import { SKILL_OPTIONS } from '@/types/job';
import { JobFormStepProps } from './types';

export default function JobDetailsStep({ 
  formData, 
  errors, 
  register, 
  watch,
  setValue, 
  handleFieldChange,
  goToNextStep
}: JobFormStepProps) {
  const selectedSkills = watch('requiredSkills') || [];
  
  const handleEditorChange = (html: string) => {
    setValue('jobDescription', html);
    handleFieldChange('jobDescription', html);
  };
  
  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setValue('requiredSkills', [...selectedSkills, skill]);
      handleFieldChange('requiredSkills', [...selectedSkills, skill]);
    }
  };
  
  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter(s => s !== skill);
    setValue('requiredSkills', updatedSkills);
    handleFieldChange('requiredSkills', updatedSkills);
  };
  
  // Generate year, month, and day options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());
  const months = [
    {value: '01', label: 'January'}, {value: '02', label: 'February'}, 
    {value: '03', label: 'March'}, {value: '04', label: 'April'}, 
    {value: '05', label: 'May'}, {value: '06', label: 'June'}, 
    {value: '07', label: 'July'}, {value: '08', label: 'August'}, 
    {value: '09', label: 'September'}, {value: '10', label: 'October'}, 
    {value: '11', label: 'November'}, {value: '12', label: 'December'}
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  return (
    <div className="space-y-6">
      <FormInput
        id="jobTitle"
        label="Job Title"
        required
        type="text"
        error={errors.jobTitle?.message}
        {...register('jobTitle', { required: 'Job title is required' })}
        onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
      />
      
      <FormInput
        id="jobCode"
        label="Job Code"
        required
        type="text"
        error={errors.jobCode?.message}
        {...register('jobCode', { required: 'Job code is required' })}
        onChange={(e) => handleFieldChange('jobCode', e.target.value)}
      />
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description<span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        <RichTextEditor 
          initialValue={formData.jobDescription}
          onChange={handleEditorChange}
        />
        {errors.jobDescription && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.jobDescription.message}
          </p>
        )}
      </div>
      
      <FormInput
        id="assignmentLink"
        label="Assignment Link (Optional)"
        type="url"
        error={errors.assignmentLink?.message}
        {...register('assignmentLink', { 
          pattern: {
            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: 'Please enter a valid URL'
          }
        })}
        onChange={(e) => handleFieldChange('assignmentLink', e.target.value)}
      />
      
      <div>
        <label htmlFor="lastDateToApply" className="block text-sm font-medium text-gray-700 mb-1">
          Last Date to Apply<span className="text-red-500 ml-1">*</span>
        </label>
        <DateSelector
          years={years}
          months={months}
          days={days}
          selectedYear={formData.lastDateToApply.year}
          selectedMonth={formData.lastDateToApply.month}
          selectedDay={formData.lastDateToApply.day}
          onYearChange={(year) => {
            setValue('lastDateToApply.year', year);
            handleFieldChange('lastDateToApply.year', year);
          }}
          onMonthChange={(month) => {
            setValue('lastDateToApply.month', month);
            handleFieldChange('lastDateToApply.month', month);
          }}
          onDayChange={(day) => {
            setValue('lastDateToApply.day', day);
            handleFieldChange('lastDateToApply.day', day);
          }}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills<span className="text-red-500 ml-1">*</span>
        </label>
        <SkillsSelector
          availableSkills={SKILL_OPTIONS}
          selectedSkills={selectedSkills}
          onSkillSelect={addSkill}
          onSkillRemove={removeSkill}
          error={errors.requiredSkills?.message}
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          onClick={goToNextStep}
        >
          Next Step
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}