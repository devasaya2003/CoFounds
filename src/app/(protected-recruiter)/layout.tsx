'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession } from '@/redux/slices/authSlice';
import { fetchRecruiterProfile } from '@/redux/slices/recruiterSlice';
import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  // Auth state
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );
  
  // Recruiter state
  const { userId, isLoading: profileLoading } = useAppSelector(
    (state) => state.recruiter
  );
  
  // Track initialization
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);
  
  // Determine active view from pathname
  const getActiveViewFromPath = (path: string) => {
    if (path.includes('/jobs/')) return 'jobs-created';
    if (path.includes('/create')) return 'create-job';
    if (path.includes('/kanban')) return 'kanban';
    return 'all-jobs';
  };
  
  const activeView = getActiveViewFromPath(pathname);
  
  // Step 1: Initialize auth when component mounts
  useEffect(() => {
    if (!authInitialized) {
      dispatch(restoreUserSession());
      setAuthInitialized(true);
    }
  }, [dispatch, authInitialized]);
  
  // Step 2: Load profile data once authentication is complete
  useEffect(() => {
    const loadProfile = async () => {
      if (
        isAuthenticated &&
        user?.id &&
        !profileInitialized &&
        !profileLoading
      ) {
        try {
          await dispatch(fetchRecruiterProfile(user.id));
          setProfileInitialized(true);
        } catch (error) {
          console.error('Failed to load recruiter profile:', error);
        }
      }
    };
    
    loadProfile();
  }, [dispatch, isAuthenticated, user, profileInitialized, profileLoading]);
  
  // Handle navigation
  const handleSidebarNavigation = (view: string) => {
    // Only navigate if the view is different from current
    if (view !== activeView) {
      if (view === 'all-jobs') {
        router.push('/recruiter/app');
      } else if (view === 'jobs-created') {
        router.push(`/recruiter/app/jobs/${encodeURIComponent(user?.userName || 'recruiter')}`);
      } else if (view === 'create-job') {
        router.push('/recruiter/app/create-job');
      } else if (view === 'kanban') {
        router.push('/recruiter/app/kanban');
      }
    }
  };
  
  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
        <p className="text-lg text-gray-600">Authenticating...</p>
      </div>
    );
  }
  
  // Auth error state
  if (authInitialized && !authLoading && !isAuthenticated) {
    router.push('/auth/recruiter-sign-in');
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={handleSidebarNavigation} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {profileLoading ? (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
              <p className="text-lg text-gray-600">Loading profile...</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}