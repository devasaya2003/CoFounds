'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserCircle, Briefcase, FileText, LogOut } from 'lucide-react';
import { AccountStatusScreen } from './AccountStatusScreen';
import { UserProfile } from '../candidate/profile/edit/api';
import { AuthUser } from '@/redux/slices/authSlice';
import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar';

// All possible states of the layout
export enum LayoutState {
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

export function CreateLayout({
    children,
    state,
    authUser,
    completeUserProfile,
    showProfileBanner,
    setShowProfileBanner,
    missingFields
}: LayoutFactoryProps) {
    const router = useRouter();
    const pathname = usePathname();
    
    // Only set up sidebar and topbar config if we're in NORMAL state
    if (state === LayoutState.NORMAL) {
        // Determine active view from pathname
        const getActiveViewFromPath = (path: string) => {
            if (path.includes('/applications')) return 'applications';
            if (path.includes('/saved-jobs')) return 'saved-jobs';
            if (path.includes('/profile')) return 'profile';
            return 'jobs';
        };

        const activeView = getActiveViewFromPath(pathname);

        // Check if user is verified
        const isVerified = authUser?.verified === true;

        // Sidebar configuration - conditional based on verification status
        const sidebarMenuItems = isVerified 
            ? [
                { id: "jobs", label: "Available Jobs" },
                { id: "applications", label: "Your Applications" },
                { id: "saved-jobs", label: "Saved Jobs" },
                { id: "profile", label: "Your Profile" },
            ]
            : [
                { id: "profile", label: "Your Profile" },
            ];

        // TopBar configuration
        const profileOptions = [
            { 
                id: "profile", 
                label: "Your Profile",
                icon: <UserCircle className="mr-2 h-4 w-4" />
            },
            { 
                id: "resume", 
                label: "Your Resume",
                icon: <FileText className="mr-2 h-4 w-4" />
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
            if (view !== activeView) {
                if (view === 'jobs') {
                    router.push('/candidate/app');
                } else if (view === 'applications') {
                    router.push('/candidate/app/applications');
                } else if (view === 'saved-jobs') {
                    router.push('/candidate/app/saved-jobs');
                } else if (view === 'profile') {
                    router.push('/candidate/app/profile');
                }
            }
        };

        // Handle top bar navigation
        const handleTopBarNavigation = (view: string) => {
            if (view !== activeView) {
                if (view === 'profile') {
                    router.push('/candidate/app/profile');
                } else if (view === 'resume') {
                    router.push('/candidate/app/resume');
                }
            }
        };

        const userName = completeUserProfile?.firstName && completeUserProfile?.lastName
            ? `${completeUserProfile.firstName} ${completeUserProfile.lastName}`.trim()
            : authUser?.userName || 'User';

        // Add verification status banner if the user is not verified
        const showVerificationBanner = !isVerified;

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
                        dashboardTitle="Candidate Dashboard"
                        userName={userName}
                        profileOptions={profileOptions}
                    />
                    
                    {/* Verification banner */}
                    {showVerificationBanner && (
                        <div className="bg-blue-50 border-blue-200 border-b px-6 py-3">
                            <div className="flex justify-between items-center">
                                <p className="text-blue-800">
                                    Your account is pending verification. Access to all features will be available once verified.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Profile completion banner if needed */}
                    {showProfileBanner && missingFields.length > 0 && (
                        <div className="bg-amber-50 border-amber-200 border-b px-6 py-3">
                            <div className="flex justify-between items-center">
                                <p className="text-amber-800">
                                    Your profile is incomplete. Please complete your profile to access all features.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => router.push('/candidate/profile/edit')}
                                        className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-1 rounded"
                                    >
                                        Complete Profile
                                    </button>
                                    <button 
                                        onClick={() => setShowProfileBanner(false)}
                                        className="text-amber-800 hover:text-amber-900"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // For other states, keep the existing logic
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

        default:
            // Should never reach here since we handle NORMAL state above
            return <>{children}</>;
    }
}