import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setStep } from '@/redux/slices/candidateOnboardingSlice';

export function useOnboardingNavigation(currentStep: number, steps: string[]) {
  const dispatch = useAppDispatch();
  const isHashChangeFromWithin = useRef(false);
  const isInitialMount = useRef(true);
  
  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (isHashChangeFromWithin.current) {
        isHashChangeFromWithin.current = false;
        return;
      }
      
      const hash = window.location.hash.replace('#', '');
      const stepIndex = steps.findIndex(step => step === hash);
      
      if (stepIndex !== -1) {
        dispatch(setStep(stepIndex + 1));
      } else if (!hash) {
        dispatch(setStep(1));
      }
    };
    
    // Initial setup - only runs once
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!window.location.hash && steps[currentStep - 1]) {
        isHashChangeFromWithin.current = true;
        window.location.hash = steps[currentStep - 1];
      } else if (window.location.hash) {
        handleHashChange();
      }
    }
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch, steps, currentStep]); // Now we can safely include currentStep
  
  // Update hash when step changes
  useEffect(() => {
    // Skip the first render to avoid double-execution
    if (isInitialMount.current) {
      return;
    }
    
    const currentStepHash = steps[currentStep - 1];
    if (currentStepHash && window.location.hash !== `#${currentStepHash}`) {
      isHashChangeFromWithin.current = true;
      window.location.hash = currentStepHash;
    }
  }, [currentStep, steps]);

  return {
    goToStep: (step: number) => {
      if (step >= 1 && step <= steps.length) {
        dispatch(setStep(step));
      }
    },
    goToNextStep: () => {
      if (currentStep < steps.length) {
        dispatch(setStep(currentStep + 1));
      }
    },
    goToPreviousStep: () => {
      if (currentStep > 1) {
        dispatch(setStep(currentStep - 1));
      }
    }
  };
}