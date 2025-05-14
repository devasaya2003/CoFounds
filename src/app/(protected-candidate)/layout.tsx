'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession } from '@/redux/slices/authSlice';
import { UserProfile, getUserProfile } from './candidate/profile/edit/api';
import { CreateLayout, LayoutState } from './components/LayoutFactory';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const {
    user: authUser,
    isAuthenticated,
    isLoading: authLoading,
    isLoadingUserDetails,
    layoutInitialized: authInitialized
  } = useAppSelector((state) => state.auth);

  const [completeUserProfile, setCompleteUserProfile] = useState<UserProfile | null>(null);
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(true);

  const [sessionRestored, setSessionRestored] = useState(false);

  // Session restoration effect
  useEffect(() => {
    if (!sessionRestored && !authLoading) {
      dispatch(restoreUserSession());
      setSessionRestored(true);
    }
  }, [dispatch, sessionRestored, authLoading, isAuthenticated]);

  // Profile fetching effect
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (
        !isAuthenticated ||
        !authUser?.id ||
        isLoadingUserDetails ||
        userDetailsFetched ||
        !sessionRestored
      ) {
        return;
      }

      setUserDetailsFetched(true);

      try {
        const profileData = await getUserProfile(authUser.id);
        setCompleteUserProfile(profileData);
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        setCompleteUserProfile({} as UserProfile);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, authUser?.id, isLoadingUserDetails, userDetailsFetched, sessionRestored]);

  // Profile completeness check
  const hasCompleteProfile = (): boolean => {
    if (!completeUserProfile) {
      return false;
    }
    
    // Check basic info fields
    const hasBasicInfo = !!(
      completeUserProfile.userName &&
      completeUserProfile.firstName &&
      completeUserProfile.lastName &&
      completeUserProfile.dob
    );
    
    // Check skills
    const hasSkills = !!(
      completeUserProfile.skillset &&
      Array.isArray(completeUserProfile.skillset) &&
      completeUserProfile.skillset.length > 0
    );
    
    // Check education
    const hasEducation = !!(
      completeUserProfile.education &&
      Array.isArray(completeUserProfile.education) &&
      completeUserProfile.education.length > 0
    );
    
    // Check experience
    const hasExperience = !!(
      completeUserProfile.experience &&
      Array.isArray(completeUserProfile.experience) &&
      completeUserProfile.experience.length > 0
    );
    
    // All required components must be present
    const isComplete = hasBasicInfo && hasSkills && hasEducation && hasExperience;
    return isComplete;
  };

  // Path matching helper
  const isPathMatching = (pattern: string): boolean => {
    const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const normalizedPattern = pattern.endsWith('/') ? pattern.slice(0, -1) : pattern;
    const result = normalizedPath.startsWith(normalizedPattern);
    return result;
  };

  // User verification check
  const isUserVerified = (): boolean => {
    const result = authUser?.verified === true;
    return result;
  };

  // Get missing profile fields
  const getMissingFields = () => {
    if (!completeUserProfile) return [];

    const missingFields = [];

    if (!completeUserProfile?.userName)
      missingFields.push({ name: 'Username', tab: 'personal-info', required: true });

    if (!completeUserProfile?.firstName)
      missingFields.push({ name: 'First Name', tab: 'personal-info', required: true });

    if (!completeUserProfile?.lastName)
      missingFields.push({ name: 'Last Name', tab: 'personal-info', required: true });

    if (!completeUserProfile?.dob)
      missingFields.push({ name: 'Date of Birth', tab: 'personal-info', required: true });

    if (!completeUserProfile?.skillset || completeUserProfile.skillset.length === 0)
      missingFields.push({ name: 'Skills', tab: 'skills', required: true });

    if (!completeUserProfile?.education || completeUserProfile.education.length === 0)
      missingFields.push({ name: 'Education', tab: 'education', required: true });

    if (!completeUserProfile?.experience || completeUserProfile.experience.length === 0)
      missingFields.push({ name: 'Proof Of Work', tab: 'proof-of-work', required: true });

    return missingFields;
  };

  // Determine layout state
  const determineLayoutState = (): LayoutState => {
    if (authLoading || isLoadingUserDetails || !sessionRestored) {
      return LayoutState.LOADING;
    }

    if (
      isAuthenticated &&
      authUser?.userName &&
      (!userDetailsFetched || !completeUserProfile)
    ) {
      return LayoutState.LOADING;
    }

    if (sessionRestored && !authLoading && !isAuthenticated) {
      return LayoutState.UNAUTHENTICATED;
    }

    if (isAuthenticated && isPathMatching('/candidate/profile/edit')) {
      return LayoutState.NORMAL;
    }

    const profileComplete = hasCompleteProfile();
    const isVerified = isUserVerified();

    if (isAuthenticated && !profileComplete) {
      if (isPathMatching('/candidate/app')) {
        return LayoutState.PROFILE_INCOMPLETE;
      } else {
        return LayoutState.NORMAL;
      }
    }

    if (isAuthenticated && !isVerified) {
      return LayoutState.UNVERIFIED;
    }

    return LayoutState.NORMAL;
  };

  // Get current layout state
  const layoutState = determineLayoutState();

  // Redirect if unauthenticated
  if (layoutState === LayoutState.UNAUTHENTICATED) {
    router.replace('/auth/sign-in');
    return null;
  }

  // Create and return appropriate layout
  return CreateLayout({
    children,
    state: layoutState,
    authUser,
    completeUserProfile,
    showProfileBanner,
    setShowProfileBanner,
    missingFields: getMissingFields()
  });
}