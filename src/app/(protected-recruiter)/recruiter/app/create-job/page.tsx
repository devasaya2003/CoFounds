'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import StepIndicator from '@/components/StepIndicator/StepIndicator';
import Alert from '@/components/Alert/Alert';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setTitle,
  setJobCode,
  setJobDesc,
  setAssignmentLink,
  setLastDateToApply,
  addSkill,
  removeSkill,
  addQuestion,
  removeQuestionAction,
  updateQuestion,
  setStep,
  setStatus,
  SkillWithId,
  setLocation,
  setRequestedBy,
  setPackage,
  updateSkillLevel
} from '@/redux/slices/jobCreationSlice';
import { createJobWithSkillsAndQuestions } from '@/redux/thunks/jobCreationThunks';
import JobDetailsStep from './components/JobDetailsStep';
import AdditionalQuestionsStep from './components/AdditionalQuestionsStep';
import { JobFormFields } from './components/types';

// Define a custom field type that includes an ID for React keys
interface QuestionFieldWithId {
  id: string;
  value: string;
}

export default function CreateJobPage() {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get form data from Redux
  const jobCreation = useAppSelector(state => state.jobCreation);
  const auth = useAppSelector(state => state.auth); // Assume you have auth state with user info
  
  // Initialize date from ISO string with zero time
  const lastDateObj = new Date(jobCreation.last_date_to_apply);
  const formInitialValues: JobFormFields = {
    title: jobCreation.title,
    job_code: jobCreation.job_code,
    job_desc: jobCreation.job_desc,
    assignment_link: jobCreation.assignment_link,
    required_skills: jobCreation.required_skills,
    last_date_to_apply: {
      year: lastDateObj.getFullYear().toString(),
      month: (lastDateObj.getMonth() + 1).toString().padStart(2, '0'),
      day: lastDateObj.getDate().toString().padStart(2, '0')
    },
    additional_questions: jobCreation.additional_questions,
    location: jobCreation.location,
    requested_by: jobCreation.requested_by,
    package: jobCreation.package
  };
  
  // Form handling with React Hook Form
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<JobFormFields>({
    defaultValues: formInitialValues,
    mode: 'onChange'
  });

  // Create our own fields array with IDs for React keys
  const [questionFields, setQuestionFields] = useState<QuestionFieldWithId[]>(
    jobCreation.additional_questions.map(q => ({
      id: crypto.randomUUID(),
      value: q
    }))
  );
  
  // Create our own append/remove functions
  const appendQuestion = (question: string) => {
    const newField = { id: crypto.randomUUID(), value: question };
    setQuestionFields([...questionFields, newField]);
    
    // Update form value and Redux
    const newQuestions = [...(watch('additional_questions') || []), question];
    setValue('additional_questions', newQuestions);
    dispatch(addQuestion(question));
  };
  
  const removeQuestion = (index: number) => {
    // Update our fields
    const newFields = [...questionFields];
    newFields.splice(index, 1);
    setQuestionFields(newFields);
    
    // Update form value and Redux
    const newQuestions = [...watch('additional_questions')];
    newQuestions.splice(index, 1);
    setValue('additional_questions', newQuestions);
    dispatch(removeQuestionAction(index));
  };
  
  const updateQuestionValue = (index: number, value: string) => {
    // Update our fields
    const newFields = [...questionFields];
    newFields[index].value = value;
    setQuestionFields(newFields);
    
    // Update form value and Redux
    const newQuestions = [...watch('additional_questions')];
    newQuestions[index] = value;
    setValue('additional_questions', newQuestions);
    dispatch(updateQuestion({ index, question: value }));
  };
  
  // Register custom validation
  useEffect(() => {
    register('required_skills', { 
      validate: value => (value && value.length > 0) || 'At least one skill is required' 
    });
    
    register('job_desc', {
      required: 'Job description is required'
    });
  }, [register]);
  
  // Handle form submission
  const onSubmit: SubmitHandler<JobFormFields> = (data) => {
    // Update Redux state with form data
    dispatch(setTitle(data.title));
    dispatch(setJobCode(data.job_code));
    dispatch(setJobDesc(data.job_desc));
    dispatch(setAssignmentLink(data.assignment_link));
    dispatch(setLastDateToApply(data.last_date_to_apply));
    dispatch(setLocation(data.location));
    dispatch(setRequestedBy(data.requested_by));
    dispatch(setPackage(data.package));

    // Log data for debugging
    console.log('Form data submitted:', data);
    console.log('Current Redux state before API calls:', {
      title: jobCreation.title,
      job_code: jobCreation.job_code,
      job_desc: jobCreation.job_desc,
      assignment_link: jobCreation.assignment_link,
      required_skills: jobCreation.required_skills,
      last_date_to_apply: jobCreation.last_date_to_apply,
      additional_questions: jobCreation.additional_questions,
      location: jobCreation.location,
      requested_by: jobCreation.requested_by,
      package: jobCreation.package,
      status: jobCreation.status
    });
    
    // Call the thunk to handle API requests
    dispatch(createJobWithSkillsAndQuestions())
      .unwrap()
      .then((result) => {
        console.log('Job creation successful:', result);
        router.push('/recruiter/app');
      })
      .catch((error) => {
        console.error('Job creation failed:', error);
        // Error already handled by thunk
      });
  };
  
  // Step navigation helpers
  const validateStep1 = () => {
    const watchedValues = watch();
    if (!watchedValues.title || 
        !watchedValues.job_code || 
        !watchedValues.job_desc || 
        !watchedValues.location ||
        !watchedValues.requested_by ||
        !(watchedValues.required_skills || []).length) {
      setShowAlert(true);
      return false;
    }
    return true;
  };
  
  const goToNextStep = () => {
    if (validateStep1()) {
      dispatch(setStep(2));
    }
  };
  
  const goToPreviousStep = () => {
    dispatch(setStep(1));
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
      
      {jobCreation.status === 'error' && (
        <Alert 
          message={jobCreation.error || "An error occurred while submitting the form."}
          type="error"
          onClose={() => dispatch(setStatus({
            status: 'idle'
          }))} 
        />
      )}
      
      <StepIndicator currentStep={jobCreation.currentStep} totalSteps={2} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {jobCreation.currentStep === 1 && (
          <JobDetailsStep
            formState={formInitialValues}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onTitleChange={(value) => dispatch(setTitle(value))}
            onJobCodeChange={(value) => dispatch(setJobCode(value))}
            onJobDescChange={(value) => dispatch(setJobDesc(value))}
            onAssignmentLinkChange={(value) => dispatch(setAssignmentLink(value))}
            onLocationChange={(value) => dispatch(setLocation(value))}
            onRequestedByChange={(value) => dispatch(setRequestedBy(value))}
            onPackageChange={(value) => dispatch(setPackage(value))}
            onDateChange={(date) => dispatch(setLastDateToApply(date))}
            onAddSkill={(skill: SkillWithId) => dispatch(addSkill(skill))}
            onRemoveSkill={(skillId: string) => dispatch(removeSkill(skillId))}
            onSkillLevelChange={(skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => 
              dispatch(updateSkillLevel({ skillId, skill_level: level }))
            }
            goToNextStep={goToNextStep}
          />
        )}
        
        {jobCreation.currentStep === 2 && (
          <AdditionalQuestionsStep
            questions={formInitialValues.additional_questions}
            errors={errors}
            register={register}
            setValue={setValue}
            fields={questionFields}
            append={appendQuestion}
            remove={removeQuestion}
            onQuestionChange={updateQuestionValue}
            status={jobCreation.status}
            goToPreviousStep={goToPreviousStep}
          />
        )}
      </form>
    </div>
  );
}