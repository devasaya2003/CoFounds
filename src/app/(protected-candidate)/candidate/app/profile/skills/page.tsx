'use client';

import { Loader2, CheckCircle } from 'lucide-react';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import { useSkillsForm } from './state';

export default function SkillsPage() {
  const {
    candidateSkills,
    isLoading,
    skillsCount,
    formChanged,
    isSubmitting,
    saveSuccess,
    handleSkillSelect,
    handleSkillRemove,
    handleSkillLevelChange,
    handleSubmit,
    handleResetAll
  } = useSkillsForm();

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 sm:p-6 mb-10">
      <h1 className="text-2xl font-bold mb-6">Skills</h1>
      
      <div className="space-y-6">
        {/* Skills Selection Area */}
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Add your technical skills
          </h2>
          <p className="text-gray-600 mb-4">
            Select skills and set your proficiency level for each. This helps recruiters understand your expertise.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <PaginatedSkillsSelector 
                  selectedSkills={candidateSkills}
                  onSkillSelect={handleSkillSelect}
                  onSkillRemove={handleSkillRemove}
                  onSkillLevelChange={handleSkillLevelChange}
                  fetchAll={true}
                />
              )}
            </div>
            
            {/* Form Actions */}
            <div className="flex items-center pt-4 border-t border-gray-200 mt-6">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !formChanged}
                  className="px-6 py-2.5 rounded-md font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                
                {formChanged && (
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-6 py-2.5 rounded-md font-medium transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              {saveSuccess && (
                <div className="ml-4 flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1.5" />
                  <span>Skills saved successfully!</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
