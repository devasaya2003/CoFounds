'use client';

import { useAppDispatch } from '@/redux/hooks';
import { PersonalInfoStepProps } from '../types';
import { 
  setFirstName,
  setLastName,
  setDescription,
  setDateOfBirth,
  addSkill,
  removeSkill,
  updateSkillLevel
} from '@/redux/slices/candidateOnboardingSlice';
import { SkillWithLevel } from '@/types/shared';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import { useEffect } from 'react';

export default function PersonalInfoStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
  isSubmitting 
}: PersonalInfoStepProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize dateOfBirth if not present
    if (!formState.dateOfBirth) {
      const today = new Date();
      const defaultDOB = {
        year: today.getFullYear().toString(),
        month: (today.getMonth() + 1).toString().padStart(2, '0'),
        day: today.getDate().toString().padStart(2, '0')
      };
      
      // Initialize the form and redux state with today's date
      setValue('dateOfBirth', defaultDOB);
      dispatch(setDateOfBirth(defaultDOB));
    }
  }, [formState.dateOfBirth, dispatch, setValue]);
  
  const handleFirstNameChange = (value: string) => {
    dispatch(setFirstName(value));
  };
  
  const handleLastNameChange = (value: string) => {
    dispatch(setLastName(value));
  };
  
  const handleDescriptionChange = (html: string) => {
    dispatch(setDescription(html));
  };
  
  const handleSkillAdd = (skill: SkillWithLevel) => {
    dispatch(addSkill(skill));
  };
  
  const handleSkillRemove = (skillId: string) => {
    dispatch(removeSkill(skillId));
  };
  
  const handleSkillLevelChange = (skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    dispatch(updateSkillLevel({ skillId, level }));
  };
  
  const handleDateOfBirthChange = (field: 'year' | 'month' | 'day', value: string) => {
    const currentDOB = formState.dateOfBirth || { year: '', month: '', day: '' };
    const updatedDOB = {
      ...currentDOB,
      [field]: value
    };
    setValue(`dateOfBirth.${field}`, value);
    dispatch(setDateOfBirth(updatedDOB));
    console.log('Updated DOB:', updatedDOB);
  };
  
  return (
    <PersonalInfoForm
      formState={{
        firstName: formState.firstName,
        lastName: formState.lastName,
        description: formState.description,
        skills: formState.skills,
        dateOfBirth: formState.dateOfBirth || { year: '', month: '', day: '' }
      }}
      errors={errors}
      register={register}
      watch={watch}
      setValue={setValue}
      onFirstNameChange={handleFirstNameChange}
      onLastNameChange={handleLastNameChange}
      onDescriptionChange={handleDescriptionChange}
      onSkillAdd={handleSkillAdd}
      onSkillRemove={handleSkillRemove}
      onSkillLevelChange={handleSkillLevelChange}
      onDateOfBirthChange={handleDateOfBirthChange}
      onNext={onNextStep}
      onPrevious={onPreviousStep}
      isSubmitting={isSubmitting}
      fetchAllSkills={false}
    />
  );
}