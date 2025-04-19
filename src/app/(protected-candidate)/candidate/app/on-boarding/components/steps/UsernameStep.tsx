'use client';

import { ChevronRight } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import FormInput from '@/components/FormElements/FormInput';
import { UsernameStepProps } from '../types';
import { setUserName } from '@/redux/slices/candidateOnboardingSlice';

export default function UsernameStep({
  formState,
  errors,
  register,
  setValue,
  onNextStep
}: UsernameStepProps) {
  const dispatch = useAppDispatch();
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Choose Your Username</h2>
        <p className="text-gray-600">This will be your unique identifier on CoFounds.</p>
      </div>
      
      <FormInput
        id="userName"
        label="Username"
        required
        type="text"
        error={errors.userName?.message}
        {...register('userName', { 
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' },
          pattern: { 
            value: /^[a-zA-Z0-9_-]+$/, 
            message: 'Username can only contain letters, numbers, underscores and hyphens' 
          }
        })}
        onChange={(e) => dispatch(setUserName(e.target.value))}
        placeholder="e.g., john_doe"
      />
      
      <div className="flex justify-end pt-4">
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