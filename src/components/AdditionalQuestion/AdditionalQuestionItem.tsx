'use client';

import { Trash2 } from 'lucide-react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { JobFormData } from '@/types/job';

interface AdditionalQuestionItemProps {
  index: number;
  register: UseFormRegister<JobFormData>;
  watch: UseFormWatch<JobFormData>;
  setValue: UseFormSetValue<JobFormData>;
  onRemove: () => void;
}

export default function AdditionalQuestionItem({
  index,
  register,
  watch,
  setValue,
  onRemove,
}: AdditionalQuestionItemProps) {
  const questionType = watch(`additionalQuestions.${index}.type`);
  const options = watch(`additionalQuestions.${index}.options`) || [];

  const addOption = () => {
    setValue(`additionalQuestions.${index}.options.${options.length}`, '');
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">Question {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mb-3">
        <label htmlFor={`additionalQuestions.${index}.question`} className="block text-sm font-medium text-gray-700 mb-1">
          Question Text*
        </label>
        <input
          id={`additionalQuestions.${index}.question`}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          {...register(`additionalQuestions.${index}.question` as const, { required: true })}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor={`additionalQuestions.${index}.type`} className="block text-sm font-medium text-gray-700 mb-1">
          Answer Type
        </label>
        <select
          id={`additionalQuestions.${index}.type`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          {...register(`additionalQuestions.${index}.type` as const)}
        >
          <option value="text">Text</option>
          <option value="multipleChoice">Multiple Choice</option>
        </select>
      </div>
      
      {questionType === 'multipleChoice' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Answer Options
          </label>
          <div className="space-y-2">
            {options.map((_, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={`Option ${optionIndex + 1}`}
                {...register(`additionalQuestions.${index}.options.${optionIndex}` as const, { required: true })}
              />
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={addOption}
            >
              + Add Option
            </button>
          </div>
        </div>
      )}
    </div>
  );
}