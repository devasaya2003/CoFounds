'use client';

import { useRef, useEffect } from 'react';

interface UsernameChangeAlertProps {
  onClose: () => void;
}

export default function UsernameChangeAlert({ onClose }: UsernameChangeAlertProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="mb-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Changing Your Username</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            <strong>Warning:</strong> Changing your username is not recommended as it will:
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Change your CoFounds portfolio URL</li>
            <li>Break any external links to your profile</li>
            <li>Affect how others can find you on CoFounds</li>
          </ul>
          <p className="mt-3 text-gray-700">
            Are you sure you want to continue with this change?
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}