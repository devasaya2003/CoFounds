'use client';

import { Suspense } from 'react';
import { Camera, CheckCircle, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { isExternalUrl } from './utils';
import { DatePicker } from '@/components/DatePicker/DatePicker';

// Profile Image Component
export function ProfileImageUploader({
  profileImage,
  previewUrl,
  uploadingImage,
  handleFileChange
}: {
  profileImage: string | null;
  previewUrl: string | null;
  uploadingImage: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Image
      </label>
      <div className="flex items-center">
        <div className="relative mr-6">
          {(previewUrl || profileImage) ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-200">
              {isExternalUrl(previewUrl || profileImage || '') ? (
                <img 
                  src={previewUrl || profileImage || ''} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image 
                  src={previewUrl || profileImage || ''} 
                  alt="Profile preview" 
                  fill
                  className="object-cover"
                />
              )}
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {uploadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        
        <div>
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
            <span>Choose Photo</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Recommended: Square image, at least 400x400 pixels
          </p>
        </div>
      </div>
    </div>
  );
}

// Basic Information Component
export function BasicInfoForm({
  email,
  userName,
  firstName,
  lastName,
  setFirstName,
  setLastName
}: {
  email: string;
  userName: string | null;
  firstName: string;
  lastName: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
      {/* Email - Disabled */}
      <div>
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-1.5">
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  Email address cannot be changed. Please contact support if you need to update your email.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
        />
      </div>
      
      {/* Username - Disabled */}
      <div>
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-1.5">
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  Username cannot be changed. Please contact support if you need to update your username.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <input
          type="text"
          value={userName || ''}
          disabled
          className="w-full px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
        />
      </div>
      
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
        />
      </div>
      
      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
}

// New Date of Birth Component using shadcn Calendar
export function BirthDatePicker({
  dob,
  setDob,
}: {
  dob: Date | undefined;
  setDob: (date: Date | undefined) => void;
}) {
  return (
    <DatePicker 
      date={dob} 
      setDate={setDob} 
      label="Date of Birth" 
    />
  );
}

// Description Editor Component
export function DescriptionEditorSection({
  description,
  showEditor,
  descriptionLoaded,
  handleDescriptionChange,
  handleShowEditor,
  handleContentReady
}: {
  description: string;
  showEditor: boolean;
  descriptionLoaded: boolean;
  handleDescriptionChange: (html: string) => void;
  handleShowEditor: () => void;
  handleContentReady: () => void;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        About You
      </label>
      
      {!showEditor ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          {description ? (
            <div className="mb-4">
              <div className="bg-white rounded-md p-3 border border-gray-200 mb-3 prose prose-sm max-w-none overflow-hidden max-h-32">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
              <p className="text-xs text-gray-500 italic">Preview only. Click button below to edit.</p>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No description added yet. Click button below to add one.</p>
          )}
          
          <button
            type="button"
            onClick={handleShowEditor}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm flex items-center"
          >
            <span>{description ? 'Edit Description' : 'Add Description'}</span>
          </button>
        </div>
      ) : (
        <Suspense fallback={
          <div className="border border-gray-300 rounded-lg p-4 flex justify-center items-center h-64 bg-gray-50">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        }>
          <div className="relative">
            {!descriptionLoaded && (
              <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10 rounded-lg">
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                  <span className="text-sm text-gray-500">Loading editor...</span>
                </div>
              </div>
            )}
            <RichTextEditor
              initialValue={description}
              onChange={handleDescriptionChange}
              placeholder="Tell us about yourself, your experience, and your interests..."
              minHeight="250px"
              onContentReady={handleContentReady}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}

// Form Submit Button Component
export function SubmitButtonWithStatus({
  isSubmitting,
  formChanged,
  saveSuccess
}: {
  isSubmitting: boolean;
  formChanged: boolean;
  saveSuccess: boolean;
}) {
  return (
    <div className="flex items-center pt-4">
      <button
        type="submit"
        disabled={isSubmitting || !formChanged}
        className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
          formChanged 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
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
      
      {saveSuccess && (
        <div className="ml-4 flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-1.5" />
          <span>Changes saved successfully!</span>
        </div>
      )}
    </div>
  );
}
