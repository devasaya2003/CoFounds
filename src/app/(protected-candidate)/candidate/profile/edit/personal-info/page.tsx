'use client';

import { PersonalInfoForm } from './components/PersonalInfoForm';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

export default function PersonalInfoPage() {
  const { user } = useAppSelector((state) => state.auth);

  // Use the authenticated user data instead of mock data
  const userData = {
    id: user?.id || '',
    email: user?.email || '',
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    userName: user?.userName || null,
    description: user?.description || null,
    dob: user?.dob ? new Date(user.dob) : null,
    profileImage: user?.profileImage || null,
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Personal Information</h1>
        <p className="text-gray-600 mt-2">
          Update your personal details and customize your profile
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          {/* Client component with user data from auth store */}
          <PersonalInfoForm initialData={userData} />
        </CardContent>
      </Card>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">About your personal information</p>
          <p className="mt-1">Your profile information will be visible to potential co-founders and teammates. Make sure to keep it professional and up-to-date.</p>
        </div>
      </div>
    </div>
  );
}