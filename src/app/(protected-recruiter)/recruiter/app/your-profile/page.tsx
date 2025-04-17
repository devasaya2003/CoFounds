'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchRecruiterProfile } from '@/redux/slices/recruiterSlice';
import UserProfile from '@/components/profile/UserProfile';

export default function YourProfilePage() {
  const dispatch = useAppDispatch();
  const { userId, isLoading, error } = useAppSelector(state => state.recruiter);
  const { user } = useAppSelector(state => state.auth);
  
  useEffect(() => {
    if (user?.id && !userId) {
      dispatch(fetchRecruiterProfile(user?.id));
    }
  }, [dispatch, user?.id, userId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-red-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => dispatch(fetchRecruiterProfile(userId))}
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