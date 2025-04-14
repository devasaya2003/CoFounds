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
  setStep,
  setStatus,
  setLocation,
  setRequestedBy,
  setPackage,
  resetForm
} from '@/redux/slices/jobCreationSlice';
import { createJobWithSkillsAndQuestions } from '@/redux/thunks/jobCreationThunks';
import JobDetailsStep from './components/JobDetailsStep';
import AdditionalQuestionsStep from './components/AdditionalQuestionsStep';
import { JobFormFields, QuestionFieldWithId } from './components/types';

export default function CreateJobPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Please fill all required fields before proceeding.");
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get form data from Redux
  const jobCreation = useAppSelector(state => state.jobCreation);
  
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
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<JobFormFields>({
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

  useEffect(() => {
    setQuestionFields((prevFields) =>
      jobCreation.additional_questions.map((q, index) => ({
        id: prevFields[index]?.id || crypto.randomUUID(),
        value: q
      }))
    );
  }, [jobCreation.additional_questions]);
  
  // Register custom validation
  useEffect(() => {
    register('required_skills', { 
      validate: value => (value && value.length > 0) || 'At least one skill is required' 
    });
    
    register('job_desc', {
      required: 'Job description is required'
    });
  }, [register]);
  
  // Complete reset function - resets Redux and local state
  const completeFormReset = () => {
    // Reset Redux state
    dispatch(resetForm());
    
    // Reset React Hook Form
    const emptyForm: JobFormFields = {
      title: '',
      job_code: '',
      job_desc: '',
      assignment_link: '',
      required_skills: [],
      last_date_to_apply: {
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        day: new Date().getDate().toString().padStart(2, '0')
      },
      additional_questions: [],
      location: '',
      requested_by: '',
      package: 0
    };
    
    reset(emptyForm);
    
    // Reset local state
    setQuestionFields([]);
    setShowAlert(false);
    setShowSuccessAlert(false);
    dispatch(setStep(1));
  };
  
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
    
    // Call the thunk to handle API requests
    dispatch(createJobWithSkillsAndQuestions())
      .unwrap()
      .then((result) => {
        console.log('Job creation successful:', result);

        setShowSuccessAlert(true);

        completeFormReset();
        router.push('/recruiter/app');
      })
      .catch((error) => {
        console.error('Job creation failed:', error);
        setAlertMessage("Failed to create job. Please try again.");
        setShowAlert(true);
      });
  };
  
  // Step navigation validation - fixed to correctly validate
  const validateAndGoToNextStep = () => {
    const formData = watch();
    const validationErrors = [];
    
    // Check all required fields
    if (!formData.title) validationErrors.push("Job title is required");
    if (!formData.job_code) validationErrors.push("Job code is required");
    if (!formData.job_desc) validationErrors.push("Job description is required");
    if (!formData.location) validationErrors.push("Location is required");
    if (!formData.requested_by) validationErrors.push("Requested by is required");
    if (!formData.package) validationErrors.push("Package is required");
    if (!(formData.required_skills || []).length) validationErrors.push("At least one skill is required");

    if (validationErrors.length > 0) {
      // Set appropriate error message
      setAlertMessage(validationErrors.join(", "));
      setShowAlert(true);
      return false;
    }
    
    // All validation passed, proceed to next step
    dispatch(setStep(2));
    return true;
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Job</h1>
      
      {showAlert && (
        <Alert 
          message={alertMessage}
          type="error"
          onClose={() => setShowAlert(false)} 
        />
      )}
      
      {showSuccessAlert && (
        <Alert 
          message="Job created successfully! Redirecting to job listings..."
          type="success"
          onClose={() => setShowSuccessAlert(false)} 
        />
      )}
      
      {jobCreation.status === 'error' && (
        <Alert 
          message={jobCreation.error || "An error occurred while submitting the form."}
          type="error"
          onClose={() => dispatch(setStatus({ status: 'idle' }))} 
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
            onNextStep={validateAndGoToNextStep} // Connect validation function
          />
        )}
        
        {jobCreation.currentStep === 2 && (
          <AdditionalQuestionsStep
            fields={questionFields}
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
            status={jobCreation.status}
          />
        )}
      </form>
      
      {/* Optional: Add a reset button */}
      {jobCreation.isDirty && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={completeFormReset}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Reset Form
          </button>
        </div>
      )}
    </div>
  );
}