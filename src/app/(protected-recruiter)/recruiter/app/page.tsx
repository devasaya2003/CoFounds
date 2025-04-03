"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchJobs, setSearchTerm, setCurrentPage, setActiveView } from "@/redux/slices/jobsSlice";
import TopBar from "@/components/dashboard/TopBar";
import Sidebar from "@/components/dashboard/Sidebar";
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
    jobsPerPage, 
    activeView 
  } = useAppSelector(state => state.jobs);
  
  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);
  
  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };
  
  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
  };
  
  const handleSidebarClick = (view: string) => {
    dispatch(setActiveView(view));
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={handleSidebarClick} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {activeView === "all-jobs" && "All Jobs"}
              {activeView === "jobs-created" && "Jobs Created By You"}
              {activeView === "create-job" && "Create New Job"}
              {activeView === "kanban" && "Kanban Board"}
            </h1>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
              <>
                {(activeView === "all-jobs" || activeView === "jobs-created") && (
                  <>
                    <SearchBar onSearch={handleSearch} />
                    <JobList jobs={currentJobs} />
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={handlePageChange} 
                    />
                  </>
                )}
                
                {activeView === "create-job" && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create Job Form</h2>
                    <p className="text-gray-500">Job creation form will be implemented here.</p>
                  </div>
                )}
                
                {activeView === "kanban" && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Kanban Board</h2>
                    <p className="text-gray-500">Kanban board will be implemented here.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}