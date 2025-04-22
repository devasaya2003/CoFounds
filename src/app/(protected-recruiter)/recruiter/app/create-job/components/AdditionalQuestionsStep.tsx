'use client';

import { ChevronLeft, Plus, X } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import {
  addQuestion,
  removeQuestionAction,
  updateQuestion,
  setStep
} from '@/redux/slices/jobCreationSlice';
import { AdditionalQuestionsStepProps } from './types';

export default function AdditionalQuestionsStep({
  fields,
  errors,
  register,
  setValue,
  watch,
  status
}: AdditionalQuestionsStepProps) {
  const dispatch = useAppDispatch();


  const canAddMoreQuestions = fields.length < 5;

  const appendQuestion = () => {
    if (fields.length < 5) {
      const newQuestion = '';
      const newField = { id: crypto.randomUUID(), value: newQuestion };


      const newFields = [...fields, newField];


      const newQuestions = [...(watch('additional_questions') || []), newQuestion];
      setValue('additional_questions', newQuestions);


      dispatch(addQuestion(newQuestion));
    }
  };

  const removeQuestion = (index: number) => {

    dispatch(removeQuestionAction(index));


    const newQuestions = [...watch('additional_questions')];
    newQuestions.splice(index, 1);
    setValue('additional_questions', newQuestions);
  };

  const updateQuestionValue = (index: number, value: string) => {

    dispatch(updateQuestion({ index, question: value }));


    const newQuestions = [...watch('additional_questions')];
    newQuestions[index] = value;
    setValue('additional_questions', newQuestions);
  };

  const goToPreviousStep = () => {
    dispatch(setStep(1));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Additional Questions (Optional)</h2>
          <button
            type="button"
            className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md ${canAddMoreQuestions
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            onClick={appendQuestion}
            disabled={!canAddMoreQuestions}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Question ({fields.length}/5)
          </button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-gray-500">No additional questions added yet.</p>
            <button
              type="button"
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={appendQuestion}
            >
              + Add your first question
            </button>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative border border-gray-200 rounded-md p-4 pr-12">
              <input
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your question here"
                value={field.value}
                onChange={(e) => {
                  updateQuestionValue(index, e.target.value);
                }}
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => removeQuestion(index)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
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