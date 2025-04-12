'use client';

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';

export default function ReduxDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const state = useAppSelector(state => state);
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg"
      >
        {isOpen ? 'Hide' : 'Show'} Redux State
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Redux State</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}