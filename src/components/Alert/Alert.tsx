'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AlertProps {
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Alert({ 
  message, 
  type = 'error', 
  duration = 5000, 
  onClose 
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const iconColors = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
    info: 'text-blue-400',
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md animate-fade-in">
      <div className={`px-4 py-3 rounded-md border ${bgColors[type]} relative`}>
        <div className="flex items-center">
          <AlertCircle className={`mr-2 h-5 w-5 ${iconColors[type]}`} />
          <p>{message}</p>
        </div>
        <button
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}