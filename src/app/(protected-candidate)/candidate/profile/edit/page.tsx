'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { getUserProfile, updateUserProfile, UserProfile } from './api';
import PortfolioEditForm from './components/PortfolioEditForm';
import PortfolioPreview from './components/PortfolioPreview';

export default function ProfileEditPage() {
  // Get username from auth state
  const { user } = useAppSelector(state => state.auth);
  
  // Component state
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch user data when component mounts
  useEffect(() => {
    if (!user?.userName) return;
    
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const profileData = await getUserProfile(user?.userName as string);
        setUserData(profileData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile data');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserData();
  }, [user?.userName]);
  
  // Handle mode toggle
  const handleModeToggle = () => {
    setIsEditMode(!isEditMode);
  };
  
  // Handle save changes
  const handleSaveChanges = async (formData: Partial<UserProfile>) => {
    if (!userData) return;
    
    try {
      setIsSaving(true);
      const updatedProfile = await updateUserProfile({
        ...formData,
        id: userData.id
      });
      
      // Update local state with new data
      setUserData(updatedProfile);
      
      // Show success message
      alert('Your profile has been updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(`Failed to save changes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show loading while fetching data
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200"></div>
        <p className="mt-4 text-gray-600">Loading your profile data...</p>
      </div>
    );
  }
  
  // Show error if fetch failed
  if (error || !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-700 mb-2">Failed to load profile</h2>
          <p className="text-red-600 mb-4">{error || 'Could not retrieve your profile data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with controls */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Your Portfolio' : 'Portfolio Preview'}
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Edit/Preview Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleModeToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isEditMode 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Preview
              </button>
              <button
                onClick={handleModeToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isEditMode 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Edit
              </button>
            </div>
            
            {/* Save button */}
            {isEditMode && (
              <button
                onClick={() => handleSaveChanges(userData)}
                disabled={isSaving}
                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                  isSaving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <>
                    <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isEditMode ? (
          <PortfolioEditForm 
            userData={userData} 
            onSave={handleSaveChanges}
            isSaving={isSaving} 
          />
        ) : (
          <PortfolioPreview userData={userData} />
        )}
      </div>
    </div>
  );
}