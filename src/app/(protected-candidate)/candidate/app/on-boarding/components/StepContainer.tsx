'use client';

import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormFields } from './types';
import UsernameStep from './steps/UsernameStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';

interface CandidateOnboardingState {
  userName: string;
  firstName: string;
  lastName: string;
  description: string;
  skills: Array<{
    id: string;
    name: string;
    skill_level: 'beginner' | 'intermediate' | 'advanced';
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: {
      year: string;
      month: string;
      day: string;
    };
    endDate: {
      year: string;
      month: string;
      day: string;
    } | null;
    currentlyStudying: boolean;
  }>;
  // certificates: any[];
  // proofsOfWork: any[];
  // projects: any[];
  currentStep: number;
  steps: string[];
  status: 'idle' | 'loading' | 'submitting' | 'success' | 'error';
  error: string | null;
  isDirty: boolean;
}

interface StepContainerProps {
  currentStep: number;
  form: UseFormReturn<OnboardingFormFields>;
  onboarding: CandidateOnboardingState;
  onValidateAndProceed: () => void;
  onPreviousStep: () => void;
}

export default function StepContainer({
  currentStep,
  form,
  onboarding,
  onValidateAndProceed,
  onPreviousStep
}: StepContainerProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const renderStep = (): ReactNode => {
    switch (currentStep) {
      case 1:
        return (
          <UsernameStep
            formState={{ userName: onboarding.userName }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={onValidateAndProceed}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            formState={{
              firstName: onboarding.firstName,
              lastName: onboarding.lastName,
              description: onboarding.description,
              skills: onboarding.skills,
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={onValidateAndProceed}
            onPreviousStep={onPreviousStep}
          />
        );
      case 3:
        return (
          <EducationStep
            formState={{
              education: onboarding.education,
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={onValidateAndProceed}
            onPreviousStep={onPreviousStep}
            onAddEducation={() => {}}
            onRemoveEducation={() => {}}
            onUpdateEducation={() => {}}
            maxEducationEntries={3}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return <>{renderStep()}</>;
}