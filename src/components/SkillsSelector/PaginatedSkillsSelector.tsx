'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, ChevronDown, X, Loader2, Settings } from 'lucide-react';
import { fetchSkillsPaginated } from '@/redux/masters/skillMaster';
import { useAppDispatch } from '@/redux/hooks';
import { SkillWithId } from '@/redux/slices/jobCreationSlice';

interface PaginatedSkillsSelectorProps {
  selectedSkills: SkillWithId[];
  onSkillSelect: (skill: SkillWithId) => void;
  onSkillRemove: (skillId: string) => void;
  onSkillLevelChange?: (skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => void;
  error?: string;
}

export default function PaginatedSkillsSelector({
  selectedSkills,
  onSkillSelect,
  onSkillRemove,
  onSkillLevelChange,
  error
}: PaginatedSkillsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSkills, setAvailableSkills] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [skillLevelMenuOpen, setSkillLevelMenuOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dispatch = useAppDispatch();

  // Load skills when component mounts and when page changes
  useEffect(() => {
    const loadSkills = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(fetchSkillsPaginated(currentPage)).unwrap();
        // Convert API response to basic skill format
        const skillsWithId = result.skills.map(skill => ({
          id: skill.id,
          name: skill.name
        }));
        
        // On first page, replace skills; on subsequent pages, append
        if (currentPage === 1) {
          setAvailableSkills(skillsWithId);
        } else {
          setAvailableSkills(prev => [...prev, ...skillsWithId]);
        }
        
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to load skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, [dispatch, currentPage]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      
      // Only close level menu if click is outside the menu
      if (skillLevelMenuOpen) {
        const menuRef = menuRefs.current[skillLevelMenuOpen];
        if (menuRef && !menuRef.contains(event.target as Node)) {
          setSkillLevelMenuOpen(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [skillLevelMenuOpen]);

  // Filter skills based on search term
  const filteredSkills = searchTerm
    ? availableSkills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSkills.some(selected => selected.id === skill.id)
      )
    : availableSkills.filter(skill => 
        !selectedSkills.some(selected => selected.id === skill.id)
      );

  // Load more skills
  const loadMoreSkills = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle skill selection with default level beginner
  const handleSkillSelect = (skill: {id: string, name: string}) => {
    const skillWithLevel: SkillWithId = {
      id: skill.id,
      name: skill.name,
      skill_level: 'beginner' // Default level
    };
    onSkillSelect(skillWithLevel);
    setSearchTerm('');
    setIsOpen(false);
  };

  // Handle skill level change
  const handleSkillLevelChange = (skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    console.log('Changing skill level:', skillId, level);
    if (onSkillLevelChange) {
      onSkillLevelChange(skillId, level);
    }
    setSkillLevelMenuOpen(null);
  };

  // Toggle skill level menu
  const toggleSkillLevelMenu = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSkillLevelMenuOpen(skillLevelMenuOpen === skillId ? null : skillId);
  };

  return (
    <div className="space-y-2 relative">
      {/* Selected skills display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map(skill => (
          <div 
            key={skill.id}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            <span className="mr-2">{skill.name}</span>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => toggleSkillLevelMenu(skill.id, e)}
                className="inline-flex items-center text-xs px-1.5 py-0.5 bg-indigo-200 rounded-full hover:bg-indigo-300"
              >
                <span>{skill.skill_level}</span>
                <Settings className="h-3 w-3 ml-1" />
              </button>
              
              {/* Skill level dropdown menu */}
              {skillLevelMenuOpen === skill.id && (
                <div 
                  ref={el => { menuRefs.current[skill.id] = el; }}
                  className="absolute z-50 mt-1 right-0 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 w-32"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      type="button"
                      className={`block w-full text-left px-4 py-1.5 text-sm ${skill.skill_level === 'beginner' ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleSkillLevelChange(skill.id, 'beginner')}
                    >
                      Beginner
                    </button>
                    <button
                      type="button"
                      className={`block w-full text-left px-4 py-1.5 text-sm ${skill.skill_level === 'intermediate' ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleSkillLevelChange(skill.id, 'intermediate')}
                    >
                      Intermediate
                    </button>
                    <button
                      type="button"
                      className={`block w-full text-left px-4 py-1.5 text-sm ${skill.skill_level === 'advanced' ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleSkillLevelChange(skill.id, 'advanced')}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => onSkillRemove(skill.id)}
              className="ml-2 text-indigo-600 hover:text-indigo-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {selectedSkills.length === 0 && (
          <div className="text-gray-500 text-sm py-1">
            No skills selected. Click below to add skills.
          </div>
        )}
      </div>

      {/* Skill selector dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <span className="block truncate">
            {isOpen ? 'Close' : 'Select skills'}
          </span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredSkills.length === 0 && !isLoading && (
                <div className="px-4 py-2 text-gray-500">
                  No skills found. Try a different search.
                </div>
              )}
              
              {filteredSkills.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillSelect(skill)}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                >
                  {skill.name}
                </button>
              ))}
              
              {isLoading && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  <span className="ml-2 text-indigo-600">Loading skills...</span>
                </div>
              )}
              
              {!isLoading && currentPage < totalPages && (
                <button
                  type="button"
                  onClick={loadMoreSkills}
                  className="w-full text-center py-2 text-indigo-600 hover:text-indigo-800 border-t border-gray-200"
                >
                  Load more skills
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}