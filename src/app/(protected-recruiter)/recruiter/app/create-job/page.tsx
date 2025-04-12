'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import StepIndicator from '@/components/StepIndicator/StepIndicator';
import Alert from '@/components/Alert/Alert';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateFormData, setFormStep, addArrayItem, removeArrayItem, setFormStatus } from '@/redux/slices/formsSlice';
import JobDetailsStep from './components/JobDetailsStep';
import AdditionalQuestionsStep from './components/AdditionalQuestionsStep';

export default function CreateJobPage() {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get form data from Redux
  const { data: formData, currentStep: step, status, error } = useAppSelector(
    state => state.forms.jobCreation!
  ) || {};
  
  // Form handling with React Hook Form
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });
  
  // Setup field array for additional questions
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalQuestions"
  });
  
  // Sync form data with Redux state
  useEffect(() => {
    register('requiredSkills', { 
      validate: value => (value && value.length > 0) || 'At least one skill is required' 
    });
    
    register('jobDescription', {
      required: 'Job description is required'
    });
  }, [register]);
  
  // Update form values from Redux on initial load
  useEffect(() => {
    setValue('jobTitle', formData.jobTitle);
    setValue('jobCode', formData.jobCode);
    setValue('jobDescription', formData.jobDescription);
    setValue('assignmentLink', formData.assignmentLink);
    setValue('requiredSkills', formData.requiredSkills);
    setValue('lastDateToApply', formData.lastDateToApply);
    setValue('additionalQuestions', formData.additionalQuestions);
  }, [formData, setValue]);
  
  // Handle form field changes
  const handleFieldChange = (fieldPath: string, value: any) => {
    dispatch(updateFormData({
      formType: 'jobCreation',
      fieldPath,
      value
    }));
  };

  // Handle form submission
  const onSubmit: SubmitHandler<any> = (data) => {
    dispatch(setFormStatus({
      formType: 'jobCreation',
      status: 'submitting'
    }));
    
    // Simulate API call
    setTimeout(() => {
      dispatch(setFormStatus({
        formType: 'jobCreation',
        status: 'success'
      }));
      
      router.push('/recruiter/app');
    }, 1500);
  };
  
  // Helper for adding array items
  const handleAddArrayItem = (fieldPath: string, item: any) => {
    dispatch(addArrayItem({
      formType: 'jobCreation',
      fieldPath,
      item
    }));
  };
  
  // Helper for removing array items
  const handleRemoveArrayItem = (fieldPath: string, index: number) => {
    dispatch(removeArrayItem({
      formType: 'jobCreation',
      fieldPath,
      index
    }));
  };
  
  // Step navigation helpers
  const validateStep1 = () => {
    const watchedValues = watch();
    if (!watchedValues.jobTitle || 
        !watchedValues.jobCode || 
        !watchedValues.jobDescription || 
        !(watchedValues.requiredSkills || []).length) {
      setShowAlert(true);
      return false;
    }
    return true;
  };
  
  const goToNextStep = () => {
    if (validateStep1()) {
      dispatch(setFormStep({
        formType: 'jobCreation',
        step: 2
      }));
    }
  };
  
  const goToPreviousStep = () => {
    dispatch(setFormStep({
      formType: 'jobCreation',
      step: 1
    }));
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
      
      {status === 'error' && (
        <Alert 
          message={error || "An error occurred while submitting the form."}
          type="error"
          onClose={() => dispatch(setFormStatus({
            formType: 'jobCreation',
            status: 'idle'
          }))} 
        />
      )}
      
      <StepIndicator currentStep={step} totalSteps={2} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <JobDetailsStep
            formData={formData}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            handleFieldChange={handleFieldChange}
            goToNextStep={goToNextStep}
          />
        )}
        
        {step === 2 && (
          <AdditionalQuestionsStep
            formData={formData}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            handleFieldChange={handleFieldChange}
            goToPreviousStep={goToPreviousStep}
            fields={fields}
            append={(question) => {
              append(question);
              handleAddArrayItem('additionalQuestions', question);
            }}
            remove={remove}
            status={status}
            removeArrayItem={handleRemoveArrayItem}
          />
        )}
      </form>
    </div>
  );
}