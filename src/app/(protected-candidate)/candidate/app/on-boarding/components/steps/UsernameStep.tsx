'use client';

import { ChevronRight, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import FormInput from '@/components/FormElements/FormInput';
import { UsernameStepProps } from '../types';
import { setUserName } from '@/redux/slices/candidateOnboardingSlice';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { VALIDATE_USERNAME } from '@/utils/regex_utils/regex_validations';
import { debounce } from 'lodash';
import { fetchWithAuth_GET } from '@/utils/api';

interface UsernameCheckResponse {
  valid: boolean;
  available: boolean;
  message: string;
}

export default function UsernameStep({
  formState,
  errors,
  register,
  setValue,
  onNextStep,
  isSubmitting
}: UsernameStepProps) {
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  // First, define the actual username check function with proper dependencies
  const checkUsernameImmediate = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      setValidationMessage('');
      setIsChecking(false);
      return;
    }
    
    // Check username format first
    if (!VALIDATE_USERNAME(username)) {
      setIsAvailable(false);
      setValidationMessage('Username format is invalid. Use only letters, numbers, underscores, and dots.');
      setIsChecking(false);
      return;
    }
    
    setIsChecking(true);
    
    try {
      const data = await fetchWithAuth_GET<UsernameCheckResponse>(`/api/v1/candidate/check-user/${username}`);
      
      setIsAvailable(data.available);
      setValidationMessage(data.message);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(false);
      setValidationMessage('Failed to check username availability.');
    } finally {
      setIsChecking(false);
    }
  }, [setIsAvailable, setIsChecking, setValidationMessage]);
  
  // Then create a debounced version that will be stable across renders
  const checkUsername = useMemo(
    () => debounce(checkUsernameImmediate, 500),
    [checkUsernameImmediate]
  );
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    dispatch(setUserName(value));
    setValue('userName', value);
    
    if (value.length >= 3) {
      setIsChecking(true);
      checkUsername(value);
    } else {
      setIsAvailable(null);
      setValidationMessage('');
    }
  };
  
  // Don't forget to cancel the debounce when unmounting
  useEffect(() => {
    return () => {
      checkUsername.cancel();
    };
  }, [checkUsername]);
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Choose Your Username</h2>
        <p className="text-gray-600">This will be your unique identifier on CoFounds.</p>
      </div>
      
      <div className="relative">
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
          onChange={handleUsernameChange}
          placeholder="e.g., john_doe"
          disabled={isSubmitting} // Disable input during submission
        />
        
        {/* Validation status */}
        {formState.userName && formState.userName.length >= 3 && (
          <div className="mt-2">
            {isChecking ? (
              <div className="flex items-center text-amber-600">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                <span>Validating your username...</span>
              </div>
            ) : (
              validationMessage && (
                <div className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {validationMessage}
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNextStep}
          disabled={!isAvailable || isChecking || !!errors.userName || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}