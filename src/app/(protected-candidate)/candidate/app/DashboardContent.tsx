'use client';

import { useAppSelector } from '@/redux/hooks';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardContent() {
  const candidateData = useAppSelector((state) => state.candidate);
  
  // Check if profile is complete
  const isProfileComplete = 
    !!candidateData.userName &&
    !!candidateData.firstName &&
    !!candidateData.lastName &&
    !!candidateData.dob &&
    !!candidateData.description &&
    candidateData.skillsCount > 0 &&
    candidateData.educationCount > 0 &&
    candidateData.projectsCount > 0 &&
    candidateData.experienceCount > 0;

  // Checks for each profile section
  const profileChecks = [
    { 
      name: 'Basic Profile Info', 
      completed: !!candidateData.userName && !!candidateData.firstName && !!candidateData.lastName,
      path: '/candidate/app/profile'
    },
    { 
      name: 'Date of Birth', 
      completed: !!candidateData.dob,
      path: '/candidate/app/profile'
    },
    { 
      name: 'Description', 
      completed: !!candidateData.description,
      path: '/candidate/app/profile'
    },
    { 
      name: 'Skills', 
      completed: candidateData.skillsCount > 0,
      path: '/candidate/app/skills'
    },
    { 
      name: 'Education', 
      completed: candidateData.educationCount > 0,
      path: '/candidate/app/education'
    },
    { 
      name: 'Projects', 
      completed: candidateData.projectsCount > 0,
      path: '/candidate/app/projects'
    },
    { 
      name: 'Experience', 
      completed: candidateData.experienceCount > 0,
      path: '/candidate/app/experience'
    }
  ];

  // If profile is not complete, show completion checklist
  if (!isProfileComplete) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Complete Your Profile</h2>
          <p className="text-gray-600">Please complete your profile to create an awesome portfolio.</p>
        </div>
        
        <div className="grid gap-4 mt-6">
          {profileChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div className="flex items-center">
                {check.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mr-3" />
                )}
                <span className={check.completed ? "text-gray-700" : "text-gray-800 font-medium"}>
                  {check.name}
                </span>
              </div>
              
              {!check.completed && (
                <Link href={check.path} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm">
                  Complete Now
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If profile is complete but not verified
  if (!candidateData.verified) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto text-center">
        <Clock className="h-16 w-16 text-amber-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification In Progress</h2>
        <p className="text-gray-600 mb-6">
          Please wait, you are being verified by the awesome team at CoFounds.
          This process typically takes 1-2 business days.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block text-left">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-1" />
            <p className="text-amber-800">
              Once verified, you'll be able to apply for projects and connect with teams.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If profile is complete and verified
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">You're All Set!</h2>
      <p className="text-gray-600 mb-8">
        CoFounds is still in the brewing stage, stay tuned for an awesome flavor...
        Meanwhile, you can continue to enhance your profile by adding more projects, 
        skills, and experiences.
      </p>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 inline-block text-left">
        <p className="text-indigo-800">
          Your profile is currently visible to our team and will be available to recruiters 
          when we launch the full platform soon.
        </p>
      </div>
    </div>
  );
}
