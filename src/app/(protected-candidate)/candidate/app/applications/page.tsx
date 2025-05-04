'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function ApplicationsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
    
  const applications = [];
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Applications</h1>
      
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {/* Map through applications here */}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600">No applications yet</p>
          <p className="text-gray-500 mt-2">Start applying to jobs to see your applications here</p>
          <Link
            href="/candidate/app"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}