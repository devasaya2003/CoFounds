'use client';

import { ReactNode, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormFields, } from './types';
import {
  SkillWithId,
  Education, 
  Certificate, 
  ProofOfWork,
  Project,
} from "@/types/candidate_onboarding";
import UsernameStep from './steps/UsernameStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';
import CertificateStep from './steps/CertificateStep';
import ProofOfWorkStep from './steps/ProofOfWorkStep';
import ProjectStep from './steps/ProjectStep'; // Add this import
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppSelector } from '@/redux/hooks';

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
  projects: Project[]; // Add projects to state
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
  const [showSummary, setShowSummary] = useState(false);
  const candidateState = useAppSelector(state => state.candidateOnboarding);
  
  const handleSubmit = () => {
    // Show summary dialog
    setShowSummary(true);
    // Also proceed to next step if needed
    onValidateAndProceed();
  };

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
      case 6:
        return (
          <ProjectStep
            formState={{
              projects: onboarding.projects || [],
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleSubmit}
            onPreviousStep={onPreviousStep}
            onAddProject={() => {}}
            onRemoveProject={() => {}}
            onUpdateProject={() => {}}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <>
      {renderStep()}
      
      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Your Onboarding Data</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px] text-xs">
              {JSON.stringify(candidateState, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}