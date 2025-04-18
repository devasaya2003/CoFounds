'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchRecruiterProfile } from '@/redux/slices/recruiterSlice';
import { fetchJobsByRecruiter } from '@/redux/slices/jobsSlice';
import UserProfile from '@/components/profile/UserProfile';

export default function YourProfilePage() {
  const dispatch = useAppDispatch();
  const { userId, isLoading: profileLoading, error: profileError } = useAppSelector(state => state.recruiter);
  const { isLoading: jobsLoading, error: jobsError } = useAppSelector(state => state.jobs);
  const { user } = useAppSelector(state => state.auth);
  
  // Use a ref to track if we've already fetched data
  const hasLoadedJobs = useRef(false);
  
  // Load the recruiter profile and their jobs
  useEffect(() => {
    // Fetch profile data if needed
    if (user?.id && !userId) {
      dispatch(fetchRecruiterProfile(user.id));
    }
    
    // Fetch jobs only once when userId is available and we haven't already loaded
    if (userId && !hasLoadedJobs.current) {
      dispatch(fetchJobsByRecruiter(userId));
      hasLoadedJobs.current = true;
    }
  }, [dispatch, userId, user?.id]);

  // Show loading state while either profile or jobs are loading
  if (profileLoading || (jobsLoading && !hasLoadedJobs.current)) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error with profile or jobs
  if (profileError || jobsError) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-red-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{profileError || jobsError}</p>
          <button 
            onClick={() => {
              // Reset the ref so we can try loading again
              hasLoadedJobs.current = false;
              
              if (user?.id) {
                dispatch(fetchRecruiterProfile(user.id));
                if (userId) {
                  dispatch(fetchJobsByRecruiter(userId));
                }
              }
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <UserProfile profileType="recruiter" />
    </div>
  );
}