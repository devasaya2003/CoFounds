'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Info, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import SkillsForm, { SkillsFormRef } from '../../edit/components/SkillsForm';
import { SkillsUpdatePayload } from '../../edit/components/types';
import { Card, CardContent } from '@/components/ui/card';

export default function UserSkillsetPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const skillsFormRef = useRef<SkillsFormRef>(null);
  const [profileData, setProfileData] = useState<any>(null);

  // Load profile data (in a real implementation, this would be an API call)
  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => {
      // Mock profile data structure that SkillsForm expects
      setProfileData({
        id: user?.id || '',
        skillset: [], // This would normally be populated from API
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleChanges = (hasUnsavedChanges: boolean) => {
    setHasChanges(hasUnsavedChanges);
  };

  const handleSave = async () => {
    if (!skillsFormRef.current) return;
    
    setIsSaving(true);
    
    try {
      // Call the saveForm method on the SkillsForm ref
      skillsFormRef.current.saveForm();
      
      // This is where we would make the API call in a real implementation
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Skills saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving skills:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveData = (data: SkillsUpdatePayload) => {
    // In a real implementation, this would make an API call
    console.log('Skills data to save:', data);
    
    // Mock successful save
    setTimeout(() => {
      setHasChanges(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    if (skillsFormRef.current) {
      skillsFormRef.current.resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading your skills...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Skills</h1>
        <p className="text-gray-600 mt-2">
          Add and manage your skills to showcase your expertise to potential co-founders
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          {profileData && (
            <SkillsForm
              ref={skillsFormRef}
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
              Save Skills
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">About your skills</p>
          <p className="mt-1">
            Adding relevant skills helps potential co-founders understand your expertise and increases 
            your chances of finding the right match. Be sure to rate your skill level accurately.
          </p>
        </div>
      </div>
    </div>
  );
}