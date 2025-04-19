'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import StepIndicator from '@/components/StepIndicator/StepIndicator';
import Alert from '@/components/Alert/Alert';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setStatus, resetForm } from '@/redux/slices/candidateOnboardingSlice';
import { OnboardingFormFields } from './components/types';
import { validateStep } from './utils/validation';
import { useOnboardingNavigation } from './hooks/useOnboardingNavigation';
import StepContainer from './components/StepContainer';

export default function CandidateOnboarding() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Please fill all required fields before proceeding.");
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get form data from Redux
  const onboarding = useAppSelector(state => state.candidateOnboarding);
  
  // Form handling with React Hook Form
  const form = useForm<OnboardingFormFields>({
    defaultValues: {
      userName: onboarding.userName,
      firstName: onboarding.firstName,
      lastName: onboarding.lastName,
      description: onboarding.description,
      skills: onboarding.skills,
      education: onboarding.education,
      certificates: onboarding.certificates,
      proofsOfWork: onboarding.proofsOfWork,
      projects: onboarding.projects,
    },
    mode: 'onChange'
  });
  
  const { watch, reset, register, handleSubmit } = form;
  
  // Use our custom navigation hook
  const { goToPreviousStep, goToNextStep, goToStep } = useOnboardingNavigation(
    onboarding.currentStep, 
    onboarding.steps
  );
  
  // Register custom validation
  useEffect(() => {
    register('description', { required: 'Description is required' });
    register('skills', { 
      validate: value => (value && value.length > 0) || 'At least one skill is required' 
    });
  }, [register]);
  
  // Form validation for current step
  const validateAndGoToNextStep = () => {
    const formData = watch();
    const { isValid, errors: validationErrors } = validateStep(onboarding.currentStep, formData);
    
    if (!isValid) {
      setAlertMessage(validationErrors.join(", "));
      setShowAlert(true);
      return false;
    }
    
    // All validation passed, proceed to next step
    goToNextStep();
    return true;
  };
  
  // Complete form reset
  const completeFormReset = () => {
    dispatch(resetForm());
    reset({
      userName: '',
      firstName: '',
      lastName: '',
      description: '',
      skills: [],
      education: [],
      certificates: [],
      proofsOfWork: [],
      projects: [],
    });
    setShowAlert(false);
    
    // Also reset to step 1 (if not already included in resetForm)
    if (onboarding.currentStep !== 1) {
      // Check if the hook provides goToStep function
      if (typeof goToStep === 'function') {
        goToStep(1);
      } else {
        // Manual navigation to step 1
        window.location.hash = onboarding.steps[0];
      }
    }
  };
  
  // Handle form submission (final step)
  const onSubmit: SubmitHandler<OnboardingFormFields> = (data) => {
    console.log('Form data to submit:', data);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h1>
      
      {showAlert && (
        <Alert 
          message={alertMessage}
          type="error"
          onClose={() => setShowAlert(false)} 
        />
      )}
      
      {onboarding.status === 'error' && (
        <Alert 
          message={onboarding.error || "An error occurred while submitting the form."}
          type="error"
          onClose={() => dispatch(setStatus({ status: 'idle' }))} 
        />
      )}
      
      <StepIndicator 
        currentStep={onboarding.currentStep} 
        totalSteps={onboarding.steps.length} 
      />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepContainer
          currentStep={onboarding.currentStep}
          form={form}
          onboarding={onboarding}
          onValidateAndProceed={validateAndGoToNextStep}
          onPreviousStep={goToPreviousStep}
        />
      </form>
      
      {onboarding.isDirty && (
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