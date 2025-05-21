'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession } from '@/redux/slices/authSlice';
import { fetchCandidateSummary } from '@/redux/slices/candidateSlice';
import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar';
import { UserCircle, BookOpen, Code, Briefcase, Award, LogOut } from 'lucide-react';

export default function CandidateLayout({
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

  // Candidate state
  const { 
    userId, 
    firstName, 
    lastName, 
    isLoading: profileLoading 
  } = useAppSelector((state) => state.candidate);

  // Track initialization
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);

  // Determine active view from pathname
  const getActiveViewFromPath = (path: string) => {
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/skills')) return 'skills';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/experience')) return 'experience';
    if (path.includes('/education')) return 'education';
    if (path.includes('/certificates')) return 'certificates';
    return 'dashboard';
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
          await dispatch(fetchCandidateSummary(user.id));
          setProfileInitialized(true);
        } catch (error) {
          console.error('Failed to load candidate profile:', error);
        }
      }
    };

    loadProfile();
  }, [dispatch, isAuthenticated, user, profileInitialized, profileLoading]);

  // Sidebar configuration
  const sidebarMenuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile", icon: <UserCircle className="mr-2 h-4 w-4" /> },
    { id: "skills", label: "Skills", icon: <Code className="mr-2 h-4 w-4" /> },
    { id: "projects", label: "Projects", icon: <BookOpen className="mr-2 h-4 w-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="mr-2 h-4 w-4" /> },
    { id: "education", label: "Education", icon: <Award className="mr-2 h-4 w-4" /> },
    { id: "certificates", label: "Certificates" },
  ];

  // TopBar configuration
  const profileOptions = [
    { 
      id: "profile", 
      label: "Your Profile",
      icon: <UserCircle className="mr-2 h-4 w-4" />
    },
    { 
      id: "logout", 
      label: "Sign Out",
      icon: <LogOut className="mr-2 h-4 w-4" />,
      divider: true,
      href: "/auth/logout"
    },
  ];

  // Handle navigation
  const handleSidebarNavigation = (view: string) => {
    // Only navigate if the view is different from current
    if (view !== activeView) {
      if (view === 'dashboard') {
        router.push('/candidate/app');
      } else if (view === 'profile') {
        router.push('/candidate/app/profile');
      } else if (view === 'skills') {
        router.push('/candidate/app/skills');
      } else if (view === 'projects') {
        router.push('/candidate/app/projects');
      } else if (view === 'experience') {
        router.push('/candidate/app/experience');
      } else if (view === 'education') {
        router.push('/candidate/app/education');
      } else if (view === 'certificates') {
        router.push('/candidate/app/certificates');
      }
    }
  };

  // Handle top bar navigation
  const handleTopBarNavigation = (view: string) => {
    if (view !== activeView) {
      if (view === 'profile') {
        router.push('/candidate/app/profile');
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
    router.push('/auth/candidate-sign-in');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleSidebarNavigation} 
        menuItems={sidebarMenuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          activeView={activeView} 
          onViewChange={handleTopBarNavigation} 
          dashboardTitle="Candidate Portal"
          userName={`${firstName || ''} ${lastName || ''}`.trim() || 'Candidate'}
          profileOptions={profileOptions}
        />
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
