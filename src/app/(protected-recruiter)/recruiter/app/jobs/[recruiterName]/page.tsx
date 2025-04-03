'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchJobsByRecruiter, setSearchTerm, setCurrentPage } from "@/redux/slices/jobsSlice";
import SearchBar from "@/components/dashboard/SearchBar";
import JobList from "@/components/dashboard/JobList";
import Pagination from "@/components/dashboard/Pagination";

export default function RecruiterJobs() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { recruiterName } = useParams();
  
  const { 
    filteredJobs, 
    isLoading, 
    error, 
    currentPage, 
    totalPages 
  } = useAppSelector(state => state.jobs);
  
  const { userId } = useAppSelector(state => state.recruiter);
  
  const [initialized, setInitialized] = useState(false);
  
  // Load jobs when component mounts and user ID is available
  useEffect(() => {
    if (!initialized && userId) {
      dispatch(fetchJobsByRecruiter(userId));
      setInitialized(true);
    }
  }, [dispatch, initialized, userId]);
  
  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
    dispatch(fetchJobsByRecruiter(userId));
  };
  
  // Handle search
  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
  };
  
  // Handle retry on error
  const handleRetry = () => {
    dispatch(fetchJobsByRecruiter(userId));
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Jobs Created By {decodeURIComponent(recruiterName as string)}
          </h1>
          <button
            onClick={() => router.push('/recruiter/app')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to All Jobs
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
          <p className="text-lg text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Jobs Created By {decodeURIComponent(recruiterName as string)}
          </h1>
          <button
            onClick={() => router.push('/recruiter/app')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to All Jobs
          </button>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Jobs Created By {decodeURIComponent(recruiterName as string)}
        </h1>
        <button
          onClick={() => router.push('/recruiter/app')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to All Jobs
        </button>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      {filteredJobs.length > 0 ? (
        <>
          <JobList jobs={filteredJobs} />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600">No jobs found</p>
          <p className="text-gray-500 mt-2">
            You haven't created any jobs yet or no jobs match your search
          </p>
        </div>
      )}
    </div>
  );
}