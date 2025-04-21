'use client';

import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  OnboardingFormFields, 
  ProofOfWork,
  Education,
  Certificate,
} from './types'; // Import all the types you need

import UsernameStep from './steps/UsernameStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';
import CertificateStep from './steps/CertificateStep';
import ProofOfWorkStep from './steps/ProofOfWorkStep';
import { SkillWithId } from '@/redux/slices/candidateOnboardingSlice';

// Use the imported types in your state interface
interface CandidateOnboardingState {
  userName: string;
  firstName: string;
  lastName: string;
  description: string;
  skills: SkillWithId[];
  education: Education[];
  certificates: Certificate[];
  proofsOfWork: ProofOfWork[];
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
            maxEducationEntries={5}
          />
        );
      case 4:
        return (
          <CertificateStep
            formState={{
              certificates: onboarding.certificates || [],
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={onValidateAndProceed}
            onPreviousStep={onPreviousStep}
            onAddCertificate={() => {}}
            onRemoveCertificate={() => {}}
            onUpdateCertificate={() => {}}
            maxCertificateEntries={10}
          />
        );
      case 5:
        return (
          <ProofOfWorkStep
            formState={{
              proofsOfWork: onboarding.proofsOfWork || [], // No need to transform if types are consistent
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={onValidateAndProceed}
            onPreviousStep={onPreviousStep}
            onAddProofOfWork={() => {}}
            onRemoveProofOfWork={() => {}}
            onUpdateProofOfWork={() => {}}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return <>{renderStep()}</>;
}