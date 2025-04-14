'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import DateSelector from '@/components/DateSelector/DateSelector';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import { JobDetailsStepProps } from './types';
import { SkillWithId } from '@/redux/slices/jobCreationSlice';

export default function JobDetailsStep({ 
  formState, 
  errors, 
  register, 
  watch,
  setValue, 
  onTitleChange,
  onJobCodeChange,
  onJobDescChange,
  onAssignmentLinkChange,
  onDateChange,
  onAddSkill,
  onRemoveSkill,
  goToNextStep
}: JobDetailsStepProps) {
  const selectedSkills = watch('required_skills') || [];
  
  const handleEditorChange = (html: string) => {
    setValue('job_desc', html);
    onJobDescChange(html);
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
        id="title"
        label="Job Title"
        required
        type="text"
        error={errors.title?.message}
        {...register('title', { required: 'Job title is required' })}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      
      <FormInput
        id="job_code"
        label="Job Code"
        required
        type="text"
        error={errors.job_code?.message}
        {...register('job_code', { required: 'Job code is required' })}
        onChange={(e) => onJobCodeChange(e.target.value)}
      />
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="job_desc" className="block text-sm font-medium text-gray-700">
            Job Description<span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        <RichTextEditor 
          initialValue={formState.job_desc}
          onChange={handleEditorChange}
        />
        {errors.job_desc && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.job_desc.message}
          </p>
        )}
      </div>
      
      <FormInput
        id="assignment_link"
        label="Assignment Link (Optional)"
        type="url"
        error={errors.assignment_link?.message}
        {...register('assignment_link', { 
          pattern: {
            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: 'Please enter a valid URL'
          }
        })}
        onChange={(e) => onAssignmentLinkChange(e.target.value)}
      />
      
      <div>
        <label htmlFor="last_date_to_apply" className="block text-sm font-medium text-gray-700 mb-1">
          Last Date to Apply<span className="text-red-500 ml-1">*</span>
        </label>
        <DateSelector
          years={years}
          months={months}
          days={days}
          selectedYear={formState.last_date_to_apply.year}
          selectedMonth={formState.last_date_to_apply.month}
          selectedDay={formState.last_date_to_apply.day}
          onYearChange={(year) => {
            setValue('last_date_to_apply.year', year);
            onDateChange({
              ...formState.last_date_to_apply,
              year
            });
          }}
          onMonthChange={(month) => {
            setValue('last_date_to_apply.month', month);
            onDateChange({
              ...formState.last_date_to_apply,
              month
            });
          }}
          onDayChange={(day) => {
            setValue('last_date_to_apply.day', day);
            onDateChange({
              ...formState.last_date_to_apply,
              day
            });
          }}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills<span className="text-red-500 ml-1">*</span>
        </label>
        <PaginatedSkillsSelector
          selectedSkills={selectedSkills}
          onSkillSelect={(skill: SkillWithId) => {
            const updatedSkills = [...selectedSkills, skill];
            setValue('required_skills', updatedSkills);
            onAddSkill(skill);
          }}
          onSkillRemove={(skillId: string) => {
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
            setValue('required_skills', updatedSkills);
            onRemoveSkill(skillId);
          }}
          error={errors.required_skills?.message}
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