'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, ChevronDown, X, Loader2 } from 'lucide-react';
import { fetchDegreesPaginated } from '@/redux/masters/degreeMaster';
import { useAppDispatch } from '@/redux/hooks';

interface Degree {
  id: string;
  name: string;
}

interface PaginatedDegreeSelectorProps {
  selectedDegree: string;
  onDegreeSelect: (degreeId: string, degreeName: string) => void;
  onClear: () => void;
  error?: string;
  isLoading?: boolean;
  initialDegrees?: Degree[];
  excludeDegreeIds?: string[]; // Add this new prop
}

export default function PaginatedDegreeSelector({
  selectedDegree,
  onDegreeSelect,
  onClear,
  error,
  isLoading: externalLoading,
  initialDegrees = [],
  excludeDegreeIds = [] // Default to empty array
}: PaginatedDegreeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [degrees, setDegrees] = useState<Degree[]>(initialDegrees);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDegreeName, setSelectedDegreeName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  // Look up selected degree name when component loads or selection changes
  useEffect(() => {
    if (selectedDegree) {
      // Find the degree in our loaded degrees
      const found = degrees.find(d => d.id === selectedDegree);
      if (found) {
        setSelectedDegreeName(found.name);
      } else {
        setSelectedDegreeName('');
      }
    } else {
      setSelectedDegreeName('');
    }
  }, [selectedDegree, degrees]);

  // Load degrees when component mounts and when page changes
  useEffect(() => {
    const loadDegrees = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(fetchDegreesPaginated(currentPage)).unwrap();
        
        // On first page, replace degrees; on subsequent pages, append
        if (currentPage === 1) {
          setDegrees(result.degrees);
        } else {
          setDegrees(prev => [...prev, ...result.degrees]);
        }
        
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to load degrees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDegrees();
  }, [dispatch, currentPage]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter degrees based on search term and exclusions
  const filteredDegrees = searchTerm
    ? [...degrees].filter(degree => 
        degree.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (degree.id === selectedDegree || !excludeDegreeIds.includes(degree.id))
      )
    : [...degrees].filter(degree => 
        degree.id === selectedDegree || !excludeDegreeIds.includes(degree.id)
      );

  // Load more degrees
  const loadMoreDegrees = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-2 relative">
      {/* Selected degree display */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <span className={`block truncate ${!selectedDegreeName ? 'text-gray-500' : ''}`}>
            {selectedDegreeName || 'Select a degree'}
          </span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {selectedDegree && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search degrees..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredDegrees.length === 0 && !isLoading && searchTerm && (
                <div className="px-4 py-2 text-gray-500">
                  No degrees found. Try a different search.
                </div>
              )}
              
              {filteredDegrees.map(degree => (
                <button
                  key={degree.id}
                  type="button"
                  onClick={() => {
                    onDegreeSelect(degree.id, degree.name);
                    setSearchTerm('');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none ${
                    selectedDegree === degree.id ? 'bg-indigo-100' : ''
                  }`}
                >
                  {degree.name}
                </button>
              ))}
              
              {(isLoading || externalLoading) && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  <span className="ml-2 text-indigo-600">Loading degrees...</span>
                </div>
              )}
              
              {!isLoading && !externalLoading && currentPage < totalPages && (
                <button
                  type="button"
                  onClick={loadMoreDegrees}
                  className="w-full text-center py-2 text-indigo-600 hover:text-indigo-800 border-t border-gray-200"
                >
                  Load more degrees
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