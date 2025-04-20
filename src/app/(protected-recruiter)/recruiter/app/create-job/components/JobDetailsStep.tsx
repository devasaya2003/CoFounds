'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import DateSelector from '@/components/DateSelector/DateSelector';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import { JobDetailsStepProps } from './types';
import { 
  SkillWithId, 
  setTitle, 
  setJobCode, 
  setJobDesc, 
  setAssignmentLink,
  setLocation,
  setRequestedBy, 
  setPackage,
  setLastDateToApply,
  addSkill,
  removeSkill,
  updateSkillLevel
} from '@/redux/slices/jobCreationSlice';

export default function JobDetailsStep({ 
  formState, 
  errors, 
  register, 
  watch,
  setValue,
  onNextStep // Add this prop to receive the validation function
}: JobDetailsStepProps) {
  const dispatch = useAppDispatch();
  const selectedSkills = watch('required_skills') || [];
  
  const handleEditorChange = (html: string) => {
    setValue('job_desc', html);
    dispatch(setJobDesc(html));
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setValue('package', value);
    dispatch(setPackage(value));
  };
  
  return (
    <div className="space-y-6">
      {/* Form fields remain the same */}
      <FormInput
        id="title"
        label="Job Title"
        required
        type="text"
        error={errors.title?.message}
        {...register('title', { required: 'Job title is required' })}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      />
      
      <FormInput
        id="job_code"
        label="Job Code"
        required
        type="text"
        error={errors.job_code?.message}
        {...register('job_code', { required: 'Job code is required' })}
        onChange={(e) => dispatch(setJobCode(e.target.value))}
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
      
      {/* New Field: Location */}
      <FormInput
        id="location"
        label="Location"
        required
        type="text"
        error={errors.location?.message}
        {...register('location', { required: 'Location is required' })}
        onChange={(e) => dispatch(setLocation(e.target.value))}
      />

      {/* New Field: Requested By */}
      <FormInput
        id="requested_by"
        label="Requested By"
        required
        type="text"
        error={errors.requested_by?.message}
        {...register('requested_by', { required: 'Requested by is required' })}
        onChange={(e) => dispatch(setRequestedBy(e.target.value))}
      />

      {/* New Field: Package */}
      <FormInput
        id="package"
        label="Package (in INR)"
        required
        type="number"
        error={errors.package?.message}
        {...register('package', { 
          required: 'Package is required',
          min: { value: 0, message: 'Package must be greater than 0' }
        })}
        onChange={handlePackageChange}
      />
      
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
        onChange={(e) => dispatch(setAssignmentLink(e.target.value))}
      />
      
      {/* Date selector remains the same */}
      <div>
        <label htmlFor="last_date_to_apply" className="block text-sm font-medium text-gray-700 mb-1">
          Last Date to Apply<span className="text-red-500 ml-1">*</span>
        </label>
        <DateSelector
          years={years}
          months={months}
          selectedYear={formState.last_date_to_apply.year}
          selectedMonth={formState.last_date_to_apply.month}
          selectedDay={formState.last_date_to_apply.day}
          onYearChange={(year) => {
            setValue('last_date_to_apply.year', year);
            dispatch(setLastDateToApply({
              ...formState.last_date_to_apply,
              year
            }));
          }}
          onMonthChange={(month) => {
            setValue('last_date_to_apply.month', month);
            dispatch(setLastDateToApply({
              ...formState.last_date_to_apply,
              month
            }));
          }}
          onDayChange={(day) => {
            setValue('last_date_to_apply.day', day);
            dispatch(setLastDateToApply({
              ...formState.last_date_to_apply,
              day
            }));
          }}
        />
      </div>
      
      {/* Skills selector remains the same */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills<span className="text-red-500 ml-1">*</span>
        </label>
        <PaginatedSkillsSelector
          selectedSkills={selectedSkills}
          onSkillSelect={(skill: SkillWithId) => {
            const updatedSkills = [...selectedSkills, skill];
            setValue('required_skills', updatedSkills);
            dispatch(addSkill(skill));
          }}
          onSkillRemove={(skillId: string) => {
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
            setValue('required_skills', updatedSkills);
            dispatch(removeSkill(skillId));
          }}
          onSkillLevelChange={(skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
            const updatedSkills = selectedSkills.map(skill => 
              skill.id === skillId ? { ...skill, skill_level: level } : skill
            );
            setValue('required_skills', updatedSkills);
            dispatch(updateSkillLevel({ skillId, skill_level: level }));
          }}
          error={errors.required_skills?.message}
        />
      </div>
      
      {/* Use the passed in validation function */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          onClick={onNextStep}
        >
          Next Step
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

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