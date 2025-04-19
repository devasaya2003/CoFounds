'use client';

import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import { PersonalInfoStepProps } from '../types';
import { 
  SkillWithId,
  setFirstName,
  setLastName,
  setDescription,
  addSkill,
  removeSkill,
  updateSkillLevel
} from '@/redux/slices/candidateOnboardingSlice';

export default function PersonalInfoStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep
}: PersonalInfoStepProps) {
  const dispatch = useAppDispatch();
  const selectedSkills = watch('skills') || [];
  
  const handleEditorChange = (html: string) => {
    setValue('description', html);
    dispatch(setDescription(html));
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us a bit about yourself to help create your profile.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          label="First Name"
          required
          type="text"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'First name is required' })}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
        />
        
        <FormInput
          id="lastName"
          label="Last Name"
          required
          type="text"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
          onChange={(e) => dispatch(setLastName(e.target.value))}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            About Me<span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        <RichTextEditor 
          initialValue={formState.description}
          onChange={handleEditorChange}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description.message}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills<span className="text-red-500 ml-1">*</span>
        </label>
        <PaginatedSkillsSelector
          selectedSkills={selectedSkills}
          onSkillSelect={(skill: SkillWithId) => {
            const updatedSkills = [...selectedSkills, skill];
            setValue('skills', updatedSkills);
            dispatch(addSkill(skill));
          }}
          onSkillRemove={(skillId: string) => {
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
            setValue('skills', updatedSkills);
            dispatch(removeSkill(skillId));
          }}
          onSkillLevelChange={(skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
            const updatedSkills = selectedSkills.map(skill => 
              skill.id === skillId ? { ...skill, skill_level: level } : skill
            );
            setValue('skills', updatedSkills);
            dispatch(updateSkillLevel({ skillId, skill_level: level }));
          }}
          error={errors.skills?.message}
        />
      </div>
      
      <div className="flex justify-between pt-4">
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