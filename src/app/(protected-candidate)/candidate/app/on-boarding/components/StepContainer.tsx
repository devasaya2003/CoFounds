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
import ProjectStep from './steps/ProjectStep';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  submitUserNameStep, 
  submitPersonalInfoStep,
  submitEducationStep,
  submitCertificatesStep,
  submitExperienceStep,
  submitProjectsStep
} from '@/redux/thunks/stepThunks';

interface CandidateOnboardingState {
  userName: string;
  firstName: string;
  lastName: string;
  description: string;
  skills: SkillWithId[];
  education: Education[];
  certificates: Certificate[];
  proofsOfWork: ProofOfWork[];
  projects: Project[];
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
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleStepSubmit = async () => {
    onValidateAndProceed();
    setIsSubmitting(true);
    try {
      let response;
      switch (currentStep) {
        case 1:
          response = await dispatch(submitUserNameStep()).unwrap();
          break;
        case 2:
          response = await dispatch(submitPersonalInfoStep()).unwrap();
          break;
        case 3:
          response = await dispatch(submitEducationStep()).unwrap();
          break;
        case 4:
          response = await dispatch(submitCertificatesStep()).unwrap();
          break;
        case 5:
          response = await dispatch(submitExperienceStep()).unwrap();
          break;
        case 6:
          response = await dispatch(submitProjectsStep()).unwrap();          
          setShowSummary(true);
          break;
        default:
          break;
      }
            
      if (response) {        
        onValidateAndProceed();
      }
    } catch (error) {      
      console.error("Error submitting step:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            onNextStep={handleStepSubmit}
            isSubmitting={isSubmitting}
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
            onNextStep={handleStepSubmit}
            onPreviousStep={onPreviousStep}
            isSubmitting={isSubmitting}
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
            onNextStep={handleStepSubmit}
            onPreviousStep={onPreviousStep}
            onAddEducation={() => { }}
            onRemoveEducation={() => { }}
            onUpdateEducation={() => { }}
            maxEducationEntries={5}
            isSubmitting={isSubmitting}
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
            onNextStep={handleStepSubmit}
            onPreviousStep={onPreviousStep}
            onAddCertificate={() => { }}
            onRemoveCertificate={() => { }}
            onUpdateCertificate={() => { }}
            maxCertificateEntries={10}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <ProofOfWorkStep
            formState={{
              proofsOfWork: onboarding.proofsOfWork || [],
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleStepSubmit}
            onPreviousStep={onPreviousStep}
            onAddProofOfWork={() => { }}
            onRemoveProofOfWork={() => { }}
            onUpdateProofOfWork={() => { }}
            isSubmitting={isSubmitting}
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
            onNextStep={handleStepSubmit}
            onPreviousStep={onPreviousStep}
            onAddProject={() => { }}
            onRemoveProject={() => { }}
            onUpdateProject={() => { }}
            isSubmitting={isSubmitting}
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
        <DialogContent
          className="sm:max-w-[700px] max-h-[80vh] overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle>Your Onboarding Data</DialogTitle>
          </DialogHeader>

          {/* scroll only this inner area */}
          <div
            className="mt-4 overflow-auto max-h-[70vh] bg-gray-100 p-4 pb-8 rounded-md text-xs w-full box-border"
          >
            <pre className="w-full">{JSON.stringify(candidateState, null, 2)}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}