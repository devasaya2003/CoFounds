'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession, fetchUserDetails, setLayoutInitialized } from '@/redux/slices/authSlice';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading,
    isLoadingUserDetails,
    layoutInitialized: authInitialized
  } = useAppSelector((state) => state.auth);
  
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  
  // Reset layout initialization on first render
  useEffect(() => {
    dispatch(setLayoutInitialized(false));
  }, [dispatch]);
  
  // Initialize authentication on mount
  useEffect(() => {
    // Only dispatch if not already authenticated
    if (!isAuthenticated) {
      dispatch(restoreUserSession());
    }
  }, [dispatch, isAuthenticated]);
  
  // Fetch user details only once when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && !isLoadingUserDetails && !userDetailsFetched) {
      dispatch(fetchUserDetails());
      setUserDetailsFetched(true);
    }
  }, [isAuthenticated, user?.id, isLoadingUserDetails, userDetailsFetched, dispatch]);
  
  // Set layout as initialized when auth checks are complete
  useEffect(() => {
    // Only mark as initialized when authentication is no longer loading
    if (!authLoading && !isLoadingUserDetails && authInitialized) {
      dispatch(setLayoutInitialized(true));
    }
  }, [authLoading, isLoadingUserDetails, authInitialized, dispatch]);
  
  // Determine if we're in any loading state
  const isLoading = authLoading || isLoadingUserDetails;
  
  // Show loading state during authentication or fetching user details
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
        <p className="text-lg text-gray-600">
          {authLoading ? "Authenticating..." : "Loading your profile..."}
        </p>
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (authInitialized && !authLoading && !isAuthenticated) {
    // Use replace instead of push for cleaner history
    router.replace('/auth/sign-in');
    return null;
  }
  
  // Helper function to check if the current route matches a pattern
  const isPathMatching = (pattern: string): boolean => {
    return pathname.startsWith(pattern);
  };
  
  // Show verification pending page if user is not verified
  if (isAuthenticated && user && user.verified === false) {
    // Allow access to the profile edit page even when not verified
    if (isPathMatching('/candidate/profile/edit')) {
      return <>{children}</>;
    }
    
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top Bar - moved from page.tsx */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Account Status
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.userName || 'Candidate'}</span>
            <button 
              onClick={() => router.push('/auth/sign-out')}
              className="text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Verification Pending Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Verification in Progress</h2>
                <p className="text-gray-600">Thanks for joining CoFounds!</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800">
                Our team is currently reviewing your profile. This process usually takes 1-2 business days. 
                We'll notify you via email once verification is complete.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">While you wait...</h3>
              <p className="text-gray-600 mb-4">
                You can enhance your CoFounds profile with additional information, skills, and experience. 
                A complete profile increases your chances of finding the perfect opportunity!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link 
                  href={`/portfolio/${user.userName || ''}`}
                  className="flex-1 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors text-center"
                  target="_blank"
                >
                  View Your CoFounds Portfolio
                </Link>
                
                <Link
                  href="/candidate/profile/edit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
                >
                  Edit Your Profile
                </Link>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Have questions? Contact our support team at <a href="mailto:support@cofounds.in" className="text-blue-600 hover:underline">support@cofounds.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle incomplete profile redirects using precise path matching
  if (isAuthenticated && user && (!user.userName || !user.firstName || !user.lastName)) {
    // Check for profile edit page specifically 
    if (isPathMatching('/candidate/profile/edit')) {
      return <>{children}</>;
    }
    
    // Check for onboarding page
    if (isPathMatching('/candidate/onboarding')) {
      return <>{children}</>;
    }
    
    // Redirect to onboarding for all other routes
    router.replace('/candidate/onboarding');
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to complete your profile...</p>
      </div>
    );
  }
  
  // Handle completed profile redirects from onboarding
  if (isAuthenticated && user && user.userName && user.firstName && user.lastName) {
    if (isPathMatching('/candidate/onboarding')) {
      router.replace('/candidate/app');
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
          <p className="text-lg text-gray-600">Redirecting to dashboard...</p>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
}