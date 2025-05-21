'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession } from '@/redux/slices/authSlice';
import { fetchCandidateSummary } from '@/redux/slices/candidateSlice';
import TopBar from '@/components/dashboard/TopBar';
import SideBarV2 from '@/components/dashboard/SideBarV2';
import { UserCircle, BookOpen, Code, Briefcase, Award, Link as LinkIcon, User, LogOut, GraduationCap, FileText } from 'lucide-react';

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

  // Determine active view and subview from pathname
  const getActiveViewsFromPath = (path: string) => {
    // Main views
    if (path.includes('/dashboard')) return { view: 'dashboard', subView: undefined };
    
    // Profile and sub-views
    if (path.includes('/profile')) {
      if (path.includes('/personal-info')) return { view: 'profile', subView: 'personal-info' };
      if (path.includes('/links')) return { view: 'profile', subView: 'links' };
      if (path.includes('/skills')) return { view: 'profile', subView: 'skills' };
      if (path.includes('/education')) return { view: 'profile', subView: 'education' };
      if (path.includes('/experience')) return { view: 'profile', subView: 'experience' };
      if (path.includes('/projects')) return { view: 'profile', subView: 'projects' };
      if (path.includes('/certificates')) return { view: 'profile', subView: 'certificates' };
      return { view: 'profile', subView: 'personal-info' }; // Default sub-view
    }
    
    return { view: 'dashboard', subView: undefined }; // Default view
  };

  const { view: activeView, subView: activeSubView } = getActiveViewsFromPath(pathname);

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

  // Sidebar configuration with nested items
  const sidebarMenuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard",
      icon: <FileText className="h-4 w-4" />
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: <User className="h-4 w-4" />,
      subItems: [
        { id: "personal-info", label: "Personal Info", icon: <UserCircle className="h-4 w-4" /> },
        { id: "links", label: "Links", icon: <LinkIcon className="h-4 w-4" /> },
        { id: "skills", label: "Skills", icon: <Code className="h-4 w-4" /> },
        { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
        { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
        { id: "projects", label: "Projects", icon: <BookOpen className="h-4 w-4" /> },
        { id: "certificates", label: "Certificates", icon: <Award className="h-4 w-4" /> },
      ]
    },
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

  // Handle navigation with subview support
  const handleSidebarNavigation = (view: string, subView?: string) => {
    if (view === 'dashboard') {
      router.push('/candidate/app');
    } else if (view === 'profile') {
      if (subView) {
        router.push(`/candidate/app/profile/${subView}`);
      } else {
        router.push('/candidate/app/profile/personal-info'); // Default sub-view
      }
    }
  };

  // Handle top bar navigation
  const handleTopBarNavigation = (view: string) => {
    if (view === 'profile') {
      router.push('/candidate/app/profile/personal-info');
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
      <SideBarV2 
        activeView={activeView} 
        activeSubView={activeSubView}
        onViewChange={handleSidebarNavigation} 
        menuItems={sidebarMenuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          activeView={activeView} 
          onViewChange={handleTopBarNavigation} 
          dashboardTitle="Candidate Dashboard"
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
