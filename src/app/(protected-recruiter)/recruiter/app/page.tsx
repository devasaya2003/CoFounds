'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchJobsByCompany, setSearchTerm, setCurrentPage } from "@/redux/slices/jobsSlice";
import SearchBar from "@/components/dashboard/SearchBar";
import JobList from "@/components/dashboard/JobList";
import Pagination from "@/components/dashboard/Pagination";

export default function RecruiterDashboard() {
  const dispatch = useAppDispatch();
  
  const { 
    filteredJobs, 
    isLoading, 
    error, 
    currentPage, 
    totalPages 
  } = useAppSelector(state => state.jobs);
  
  const { companyId } = useAppSelector(state => state.recruiter);
  
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (!initialized && companyId) {
      dispatch(fetchJobsByCompany());
      setInitialized(true);
    }
  }, [dispatch, initialized, companyId]);
  
  const handlePageChange = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
    dispatch(fetchJobsByCompany());
  };
  
  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
  };
  
  const handleRetry = () => {
    dispatch(fetchJobsByCompany());
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Jobs</h1>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Jobs</h1>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Jobs</h1>
      
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
          <p className="text-gray-500 mt-2">Try adjusting your search or create a new job</p>
        </div>
      )}
    </div>
  );
}