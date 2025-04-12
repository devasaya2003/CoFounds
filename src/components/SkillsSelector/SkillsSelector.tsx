'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

interface SkillsSelectorProps {
  availableSkills: string[];
  selectedSkills: string[];
  onSkillSelect: (skill: string) => void;
  onSkillRemove: (skill: string) => void;
  error?: string;
}

export default function SkillsSelector({
  availableSkills,
  selectedSkills,
  onSkillSelect,
  onSkillRemove,
  error,
}: SkillsSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSkills = useMemo(() => {
    return availableSkills.filter(skill => !selectedSkills.includes(skill));
  }, [availableSkills, selectedSkills]);

  return (
    <div className="relative">
      <div
        className={`w-full px-3 py-2 border rounded-md flex cursor-pointer min-h-10 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedSkills.length === 0 ? (
          <span className="text-gray-500">Select skills</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedSkills.map(skill => (
              <div key={skill} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md flex items-center">
                {skill}
                <button
                  type="button"
                  className="ml-1 text-indigo-500 hover:text-indigo-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSkillRemove(skill);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div
                key={skill}
                className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                onClick={() => {
                  onSkillSelect(skill);
                  setShowDropdown(false);
                }}
              >
                {skill}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No more skills available</div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          {error}
        </p>
      )}
    </div>
  );
}