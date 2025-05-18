'use client';

import { useState } from 'react';
import { Save, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import DateSelector from '@/components/DateSelector/DateSelector';
import ImageSelector from '@/components/ImageSelector/ImageSelector';
import { usePersonalInfoForm } from '../hooks/usePersonalInfoForm';

interface PersonalInfoFormProps {
  initialData: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    userName?: string | null;
    description?: string | null;
    dob?: Date | null;
    profileImage?: string | null;
  };
}

export function PersonalInfoForm({ initialData }: PersonalInfoFormProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  const {
    formState,
    usernameValidation,
    hasChanges,
    isSubmitting,
    isLoading,
    isUsernameEditable,
    email,
    handleInputChange,
    handleDateChange,
    handleImageChange,
    handleSubmit,
    resetForm
  } = usePersonalInfoForm(initialData);

  const onSubmit = async () => {
    setError(null);

    const result = await handleSubmit();

    if (result.success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else {
      setError('Failed to save changes. Please try again.');
    }
  };

  // Generate years for date selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => (currentYear - 100 + i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  // Display a loading state when fetching initial data
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading your personal information...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <ImageSelector
            imageUrl={formState.profileImage}
            isUploading={formState.isUploading}
            onImageSelect={(file) => file && handleImageChange(file)}
            onImageRemove={() => handleInputChange('profileImage', null)}
            size="lg"
            shape="circle"
            placeholderText="Add profile photo"
          />
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>Upload a profile picture</p>
            <p>JPG, PNG or GIF, max 2MB</p>
          </div>
        </div>
        
        {/* Form Fields Section */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <FormInput
                id="email"
                label="Email"
                type="email"
                value={email}
                disabled={true}
              />
              <div className="absolute inset-0 cursor-not-allowed">
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 -mt-12 left-0 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg">
                  We currently do not support changing the email.
                  <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -bottom-1"></div>
                </div>
              </div>
            </div>

            <div className={`relative ${!isUsernameEditable ? 'group' : ''}`}>
              <FormInput
                id="userName"
                label="Username"
                type="text"
                value={formState.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                disabled={!isUsernameEditable}
              />
              {!isUsernameEditable && (
                <div className="absolute inset-0 cursor-not-allowed">
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 -mt-12 left-0 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg">
                    Username cannot be changed once set.
                    <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -bottom-1"></div>
                  </div>
                </div>
              )}
              
              {/* Username validation status */}
              {isUsernameEditable && formState.userName && formState.userName.length >= 3 && (
                <div className="mt-2">
                  {usernameValidation.isChecking ? (
                    <div className="flex items-center text-amber-600">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Validating your username...</span>
                    </div>
                  ) : (
                    usernameValidation.validationMessage && (
                      <div className={`text-sm ${usernameValidation.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameValidation.validationMessage}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormInput
                id="firstName"
                label="First Name"
                required
                type="text"
                value={formState.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>

            <div>
              <FormInput
                id="lastName"
                label="Last Name"
                required
                type="text"
                value={formState.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
    
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </Label>
            <DateSelector
              years={years}
              months={months}
              selectedYear={formState.dob?.year || ''}
              selectedMonth={formState.dob?.month || ''}
              selectedDay={formState.dob?.day || ''}
              onYearChange={(value) => handleDateChange('year', value)}
              onMonthChange={(value) => handleDateChange('month', value)}
              onDayChange={(value) => handleDateChange('day', value)}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          About Me
        </Label>
        <RichTextEditor
          key={`editor-${formState.description?.substring(0, 10) || 'empty'}-${editorReady}`} 
          initialValue={formState.description || ''}
          onChange={(html) => handleInputChange('description', html)}
          onContentReady={() => setEditorReady(true)}
        />
      </div>
      
      {/* Form actions */}
      <div className="mt-6 flex justify-end space-x-3">
        {hasChanges && (
          <Button 
            variant="outline" 
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          onClick={onSubmit}
          disabled={!hasChanges || isSubmitting || (isUsernameEditable && formState.userName && usernameValidation.isAvailable === false ? true : false)}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      {/* Success message */}
      {showSuccessMessage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex justify-between items-center">
          <span>Your personal information has been updated successfully!</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSuccessMessage(false)}
            className="h-6 w-6 text-green-700"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
