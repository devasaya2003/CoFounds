'use client';

import { ReactNode } from 'react';
import { AccountStatusScreen } from './AccountStatusScreen';
import { UserProfile } from '../candidate/profile/edit/api';

// All possible states of the layout
enum LayoutState {
  LOADING,
  UNAUTHENTICATED,
  PROFILE_INCOMPLETE,
  UNVERIFIED,
  NORMAL
}

interface LayoutFactoryProps {
  children: ReactNode;
  state: LayoutState;
  authUser: any;
  completeUserProfile: UserProfile | null;
  showProfileBanner: boolean;
  setShowProfileBanner: (show: boolean) => void;
  missingFields: Array<{ name: string; tab: string; required: boolean }>;
  router: any;
}

export function createLayout({
  children,
  state,
  authUser,
  completeUserProfile,
  missingFields,
  router
}: LayoutFactoryProps) {
  console.log(`🏭 Layout factory creating component for state: ${LayoutState[state]}`);
  
  switch (state) {
    case LayoutState.LOADING:
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      );
      
    case LayoutState.UNAUTHENTICATED:
      // Redirect to sign in page
      router.replace('/auth/sign-in');
      return null;
      
    case LayoutState.PROFILE_INCOMPLETE:
      console.log('⚠️ Rendering profile incomplete state', { 
        hasUser: !!completeUserProfile, 
        missingFieldsCount: missingFields.length 
      });
      
      return (
        <AccountStatusScreen 
          user={completeUserProfile}
          authUser={authUser}
          isCompleteProfile={false}
          missingFields={missingFields}
        />
      );
      
    case LayoutState.UNVERIFIED:
      return (
        <AccountStatusScreen 
          user={completeUserProfile}
          authUser={authUser}
          isCompleteProfile={true}
          missingFields={[]}
        />
      );
      
    case LayoutState.NORMAL:
    default:
      return <>{children}</>;
  }
}

export { LayoutState };