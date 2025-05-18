'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Info, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import EducationForm from '../../edit/components/EducationForm';
import type EducationFormRef  from '../../edit/components/EducationForm';
import { Card, CardContent } from '@/components/ui/card';

export default function EducationEditPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const educationFormRef = useRef<EducationFormRef>(null);
  const [profileData, setProfileData] = useState<any>(null);

  // Load profile data (in a real implementation, this would be an API call)
  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => {
      // Mock profile data structure that EducationForm expects
      setProfileData({
        id: user?.id || '',
        education: [], // This would normally be populated from API
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleChanges = (hasUnsavedChanges: boolean) => {
    setHasChanges(hasUnsavedChanges);
  };

  const handleSave = async () => {
    if (!educationFormRef.current) return;
    
    setIsSaving(true);
    
    try {
      // Call the saveForm method on the EducationForm ref
      educationFormRef.current.saveForm();
      
      // This is where we would make the API call in a real implementation
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Education entries saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving education entries:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveData = (data: any) => {
    // In a real implementation, this would make an API call
    console.log('Education data to save:', data);
    
    // Mock successful save
    setTimeout(() => {
      setHasChanges(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    if (educationFormRef.current) {
      educationFormRef.current.resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading your education history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Education</h1>
        <p className="text-gray-600 mt-2">
          Add and manage your educational background to showcase your academic qualifications
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          {profileData && (
            <EducationForm
              ref={educationFormRef}
              profile={profileData}
              onChange={handleChanges}
              onSaveData={handleSaveData}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        {hasChanges && (
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Education
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">About your education</p>
          <p className="mt-1">
            Adding your educational background helps potential co-founders understand your academic qualifications 
            and expertise. Be sure to include relevant degrees and certifications that showcase your knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}