'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronRight, Shield, CheckCircle, XCircle } from 'lucide-react';
import { UserProfile } from '../candidate/profile/edit/api';
import { AuthUser } from '@/redux/slices/authSlice';

interface MissingField {
  name: string;
  tab: string;
  required: boolean;
}

interface AccountStatusScreenProps { 
  user: UserProfile | null;
  authUser: AuthUser | null;
  isCompleteProfile: boolean;
  missingFields?: MissingField[];
}

export function AccountStatusScreen({ 
  user, 
  authUser,
  isCompleteProfile,
  missingFields = [] 
}: AccountStatusScreenProps) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Account Status
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{authUser?.userName || 'Candidate'}</span>
          <button
            onClick={() => router.push('/auth/sign-out')}
            className="text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          {/* Welcome header */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mr-6">
              <CheckCircle className="h-8 w-8 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome to CoFounds
              </h2>
              <p className="text-gray-600">
                Your account has been created successfully!
              </p>
            </div>
          </div>

          {/* Combined status card */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${isCompleteProfile ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center mb-2">
                <div className="mr-2">
                  {isCompleteProfile ? (
                    <Shield className="h-5 w-5 text-blue-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <h3 className={`font-semibold ${isCompleteProfile ? 'text-blue-700' : 'text-amber-700'}`}>
                  {isCompleteProfile ? 'Verification Status' : 'Profile Incomplete'}
                </h3>
              </div>
              
              <div className={`text-sm ${isCompleteProfile ? 'text-blue-700' : 'text-amber-700'}`}>
                {isCompleteProfile ? (
                  <p>Our team is reviewing your profile. This process usually takes 1-2 business days.</p>
                ) : (
                  <>
                    <p className="mb-2">Your profile is incomplete. Please complete all required fields to begin the verification process.</p>
                    <p>Once your profile is complete, our team will review your information.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Missing fields section */}
          {!isCompleteProfile && missingFields.length > 0 && (
            <div className="mb-6 p-4 border-l-4 border-amber-500 bg-amber-50">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Complete Your Profile</h3>
              <p className="text-sm text-amber-700 mb-3">
                Please complete the following fields to proceed with verification:
              </p>
              <ul className="space-y-2">
                {missingFields.map((field) => (
                  <li key={field.name} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                    <span className="text-gray-700">
                      {field.name} {field.required && <span className="text-red-500">*</span>}
                    </span>
                    <button
                      onClick={() => router.push(`/candidate/profile/edit?tab=${field.tab}`)}
                      className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded flex items-center"
                    >
                      Complete <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next steps section - only show for complete profiles */}
          {isCompleteProfile ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Next Steps
              </h3>
              <p className="text-gray-600 mb-4">
                Enhance your CoFounds profile with comprehensive information to increase your visibility 
                to potential partners and increase your chances of finding the perfect opportunity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  href={`/portfolio/${authUser?.userName || ''}`}
                  className="flex-1 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors text-center"
                  target="_blank"
                >
                  View Your Portfolio
                </Link>

                <Link
                  href="/candidate/profile/edit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors text-center"
                >
                  Edit Your Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="mb-3"></div>
          )}

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