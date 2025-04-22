'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { Alert } from '@/components/ui/alert';
import { ProofOfWork } from '@/types/candidate_onboarding';
import { ProofOfWorkStepProps, ProofOfWorkFieldErrors } from '../types';
import ProofOfWorkForm from './ProofOfWorkForm';
import { addProofOfWork, removeProofOfWork, updateProofOfWork } from '@/redux/slices/candidateOnboardingSlice';

export default function ProofOfWorkStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
  onAddProofOfWork,
  onRemoveProofOfWork,
  onUpdateProofOfWork,
}: ProofOfWorkStepProps) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const proofsOfWork = watch('proofsOfWork') || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleAddProofOfWork = () => {
    const newProofOfWork: ProofOfWork = {
      id: generateTempId(),
      title: '',
      company_name: '',
      description: '',
      startDate: {
        year: currentYear.toString(),
        month: '01',
        day: '01',
      },
      endDate: {
        year: currentYear.toString(),
        month: '01',
        day: '01',
      },
      isCommunityWork: false,
      currentlyWorking: false,
    };

    setValue('proofsOfWork', [...proofsOfWork, newProofOfWork]);
    dispatch(addProofOfWork(newProofOfWork));
    onAddProofOfWork();
  };

  const handleRemoveProofOfWork = (id: string) => {
    const updatedProofs = proofsOfWork.filter(pow => pow.id !== id);
    setValue('proofsOfWork', updatedProofs);
    dispatch(removeProofOfWork(id));
    onRemoveProofOfWork(id);
  };

  const handleUpdateProofOfWork = (id: string, updates: Partial<ProofOfWork>) => {
    
    if (updates.isCommunityWork !== undefined) {
      if (updates.isCommunityWork) {
        updates.company_name = 'COF_PROOF_COMMUNITY';
      } else if (updates.company_name === 'COF_PROOF_COMMUNITY') {
        updates.company_name = '';
      }
    }

    const updatedProofs = proofsOfWork.map(pow =>
      pow.id === id ? { ...pow, ...updates } : pow
    );
    
    setValue('proofsOfWork', updatedProofs);
    dispatch(updateProofOfWork({ id, updates }));
    onUpdateProofOfWork(id, updates);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Proof of Work</h2>
        <p className="text-gray-600">Add details about your work experience, projects, or community contributions.</p>
      </div>

      {error && (
        <Alert key="error-alert" variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </Alert>
      )}

      {proofsOfWork.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No proof of work entries yet.</p>
          <button
            type="button"
            onClick={handleAddProofOfWork}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Work Experience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {proofsOfWork.map((proofOfWork, index) => (
            <ProofOfWorkForm
              key={proofOfWork.id}
              proofOfWork={proofOfWork}
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
              onRemove={() => handleRemoveProofOfWork(proofOfWork.id)}
              onUpdate={(updates) => handleUpdateProofOfWork(proofOfWork.id, updates)}
              years={years}
              months={months}
              days={days}
              errors={errors.proofsOfWork?.[index] as ProofOfWorkFieldErrors} 
            />
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddProofOfWork}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Another Entry
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 mt-6">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={onPreviousStep}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous Step
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          onClick={onNextStep}
        >
          Next Step
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}