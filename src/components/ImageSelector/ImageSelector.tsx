'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSelectorProps {
  imageUrl: string | null;
  isUploading: boolean;
  onImageSelect: (file: File | null) => void;
  onImageRemove?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  allowRemove?: boolean;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string;
  placeholderText?: string;
}

export default function ImageSelector({
  imageUrl,
  isUploading,
  onImageSelect,
  onImageRemove,
  className = '',
  size = 'md',
  shape = 'circle',
  allowRemove = true,
  maxFileSizeMB = 2,
  acceptedFileTypes = 'image/*',
  placeholderText = 'No image'
}: ImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate size based on prop
  const sizeClass = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48'
  }[size];

  // Calculate shape based on prop
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-md';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // Reset the file input so the same file can be selected again
    event.target.value = '';
    
    if (!file) {
      return;
    }
    
    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxFileSizeMB}MB`);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    
    setError(null);
    onImageSelect(file);
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageSelect(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClass} ${shapeClass} bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Selected" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Camera size={32} />
            <span className="text-sm mt-2">{placeholderText}</span>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-1 -right-1 flex space-x-1">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          size="icon"
          className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md"
          disabled={isUploading}
        >
          <Upload size={16} />
        </Button>
        
        {imageUrl && allowRemove && (
          <Button
            type="button"
            onClick={handleRemove}
            size="icon"
            variant="destructive"
            className="h-8 w-8 rounded-full shadow-md"
            disabled={isUploading}
          >
            <X size={16} />
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
