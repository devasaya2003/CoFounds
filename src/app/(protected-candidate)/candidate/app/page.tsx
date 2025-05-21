'use client';

import { Suspense } from 'react';
import { useAppSelector } from '@/redux/hooks';
import DashboardContent from './DashboardContent';

export default function CandidateDashboardPage() {
  const { isLoading, error } = useAppSelector((state) => state.candidate);

  // Remove the duplicate fetchCandidateSummary call - layout is already handling this

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
        <p className="text-lg text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Candidate Dashboard</h1>
      
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200"></div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
