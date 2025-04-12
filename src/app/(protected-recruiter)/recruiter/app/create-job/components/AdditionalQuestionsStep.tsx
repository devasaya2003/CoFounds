'use client';

import { ChevronLeft, Plus } from 'lucide-react';
import AdditionalQuestionItem from '@/components/AdditionalQuestion/AdditionalQuestionItem';
import { JobFormStepProps } from './types';

export default function AdditionalQuestionsStep({
  formData,
  errors,
  register,
  watch,
  setValue,
  handleFieldChange,
  goToPreviousStep,
  fields = [], // Provide default empty array
  append,
  remove,
  status,
  removeArrayItem
}: JobFormStepProps) {
  // Check if fields is defined before accessing its length
  const canAddMoreQuestions = fields && fields.length < 5;
  
  const addQuestion = () => {
    // Check if fields is defined and append is available
    if (fields && fields.length < 5 && append) {
      const newQuestion = { question: '', type: "text" as "text", options: [''] };
      append(newQuestion);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Additional Questions (Optional)</h2>
          <button
            type="button"
            className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md ${
              canAddMoreQuestions 
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={addQuestion}
            disabled={!canAddMoreQuestions}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Question ({fields ? fields.length : 0}/5)
          </button>
        </div>
        
        {(!fields || fields.length === 0) && (
          <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-gray-500">No additional questions added yet.</p>
            <button
              type="button"
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={addQuestion}
            >
              + Add your first question
            </button>
          </div>
        )}
        
        <div className="space-y-4">
          {fields && fields.map((field, index) => (
            <AdditionalQuestionItem
              key={field.id}
              index={index}
              register={register}
              watch={watch}
              setValue={(name, value) => {
                setValue(name, value);
                handleFieldChange(`additionalQuestions.${index}.${name.split('.').pop()}`, value);
              }}
              onRemove={() => {
                if (remove) remove(index);
                if (removeArrayItem) removeArrayItem('additionalQuestions', index);
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={goToPreviousStep}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous Step
        </button>
        
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          {status === 'submitting' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Create Job'
          )}
        </button>
      </div>
    </div>
  );
}