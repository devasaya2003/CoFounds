'use client';

import { ReactNode } from 'react';
import { AccountStatusScreen } from './AccountStatusScreen';
import { UserProfile } from '../candidate/profile/edit/api';
import { AuthUser } from '@/redux/slices/authSlice';

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
    authUser: AuthUser | null;
    completeUserProfile: UserProfile | null;
    showProfileBanner: boolean;
    setShowProfileBanner: (show: boolean) => void;
    missingFields: Array<{ name: string; tab: string; required: boolean }>;
}

export function createLayout({
    children,
    state,
    authUser,
    completeUserProfile,
    missingFields
}: LayoutFactoryProps) {
    

    switch (state) {
        case LayoutState.LOADING:
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading your profile...</p>
                </div>
            );

        case LayoutState.UNAUTHENTICATED:
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                    <p className="text-lg text-gray-600">You need to be logged in to view this page.</p>
                </div>
            );

        case LayoutState.PROFILE_INCOMPLETE:
            return (
                <AccountStatusScreen
                    user={completeUserProfile}
                    authUser={authUser || null}
                    isCompleteProfile={false}
                    missingFields={missingFields}
                />
            );

        case LayoutState.UNVERIFIED:
            return (
                <AccountStatusScreen
                    user={completeUserProfile}
                    authUser={authUser || null}
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