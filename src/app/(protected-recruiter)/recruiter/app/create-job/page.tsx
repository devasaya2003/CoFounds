'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { AlertCircle, ChevronRight, ChevronLeft, Plus } from 'lucide-react';

import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import SkillsSelector from '@/components/SkillsSelector/SkillsSelector';
import DateSelector from '@/components/DateSelector/DateSelector';
import FormInput from '@/components/FormElements/FormInput';
import AdditionalQuestionItem from '@/components/AdditionalQuestion/AdditionalQuestionItem';
import StepIndicator from '@/components/StepIndicator/StepIndicator';
import Alert from '@/components/Alert/Alert';
import { JobFormData, SKILL_OPTIONS } from '@/types/job';

export default function CreateJobPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showAlert, setShowAlert] = useState(false);
  
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
  
  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors, isValid } } = useForm<JobFormData>({
    defaultValues: {
      jobTitle: '',
      jobCode: '',
      jobDescription: '',
      assignmentLink: '',
      requiredSkills: [],
      lastDateToApply: {
        year: currentYear.toString(),
        month: '01',
        day: '01'
      },
      additionalQuestions: []
    },
    mode: 'onChange'
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalQuestions"
  });
  
  const watchedValues = watch();
  const selectedSkills = watch('requiredSkills') || [];

  const handleEditorChange = (html: string) => {
    setValue('jobDescription', html);
  };

  const onSubmit: SubmitHandler<JobFormData> = (data) => {
    console.log('Form submitted with data:', data);
    // In the future this will dispatch a thunk or action
  };
  
  const addQuestion = () => {
    if (fields.length < 5) {
      append({ question: '', type: 'text', options: [''] });
    }
  };
  
  const addSkill = (skill: string) => {
    const currentSkills = getValues('requiredSkills') || [];
    if (!currentSkills.includes(skill)) {
      setValue('requiredSkills', [...currentSkills, skill]);
    }
  };
  
  const removeSkill = (skill: string) => {
    const currentSkills = getValues('requiredSkills') || [];
    setValue('requiredSkills', currentSkills.filter(s => s !== skill));
  };

  const canAddMoreQuestions = fields.length < 5;
  
  const validateStep1 = () => {
    if (!watchedValues.jobTitle || !watchedValues.jobCode || !watchedValues.jobDescription || !selectedSkills.length) {
      setShowAlert(true);
      return false;
    }
    return true;
  };
  
  const goToNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Job</h1>
      
      {showAlert && (
        <Alert 
          message="Please fill all required fields before proceeding." 
          onClose={() => setShowAlert(false)} 
        />
      )}
      
      <StepIndicator currentStep={step} totalSteps={2} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-6">
            <FormInput
              id="jobTitle"
              label="Job Title"
              required
              type="text"
              error={errors.jobTitle?.message}
              {...register('jobTitle', { required: 'Job title is required' })}
            />
            
            <FormInput
              id="jobCode"
              label="Job Code"
              required
              type="text"
              error={errors.jobCode?.message}
              {...register('jobCode', { required: 'Job code is required' })}
            />
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                  Job Description<span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <RichTextEditor 
                initialValue={watchedValues.jobDescription}
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
            />
            
            <div>
              <label htmlFor="lastDateToApply" className="block text-sm font-medium text-gray-700 mb-1">
                Last Date to Apply<span className="text-red-500 ml-1">*</span>
              </label>
              <DateSelector
                years={years}
                months={months}
                days={days}
                selectedYear={watchedValues.lastDateToApply.year}
                selectedMonth={watchedValues.lastDateToApply.month}
                selectedDay={watchedValues.lastDateToApply.day}
                onYearChange={(year) => setValue('lastDateToApply.year', year)}
                onMonthChange={(month) => setValue('lastDateToApply.month', month)}
                onDayChange={(day) => setValue('lastDateToApply.day', day)}
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
              
              <input 
                type="hidden" 
                {...register('requiredSkills', { 
                  validate: value => (value && value.length > 0) || 'At least one skill is required' 
                })}
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
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Additional Questions (Optional)</h2>
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md ${
                    canAddMoreQuestions 
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={addQuestion}
                  disabled={!canAddMoreQuestions}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Question ({fields.length}/5)
                </button>
              </div>
              
              {fields.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <p className="text-gray-500">No additional questions added yet.</p>
                  <button
                    type="button"
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={addQuestion}
                  >
                    + Add your first question
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <AdditionalQuestionItem
                    key={field.id}
                    index={index}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    onRemove={() => remove(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous Step
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Job
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}