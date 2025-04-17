'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { Briefcase, Mail, Phone, Calendar, ChevronRight, MapPin, User } from 'lucide-react';
import { fetchJobsByRecruiter } from '@/redux/slices/jobsSlice';
import { getRecruiterFullName } from '@/redux/slices/recruiterSlice';
import { Editor } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface UserProfileProps {
  profileType: 'recruiter' | 'candidate' | 'admin';
}

export default function UserProfile({ profileType }: UserProfileProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const recruiter = useAppSelector((state) => state.recruiter);
  const { filteredJobs, isLoading } = useAppSelector((state) => state.jobs);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  // Set up TipTap editor for rendering markdown description
  const editor = useEditor({
    extensions: [StarterKit],
    content: recruiter.description || '',
    editable: false,
  });

  // Update editor content when recruiter description changes
  useEffect(() => {
    if (editor && recruiter.description) {
      editor.commands.setContent(recruiter.description);
    }
  }, [editor, recruiter.description]);

  useEffect(() => {
    if (profileType === 'recruiter' && recruiter.userId) {
      dispatch(fetchJobsByRecruiter(recruiter.userId));
    }
  }, [dispatch, profileType, recruiter.userId]);

  useEffect(() => {
    // Get only the first 3 jobs
    setRecentJobs(filteredJobs.slice(0, 3));
  }, [filteredJobs]);

  if (profileType !== 'recruiter') {
    return <div className="p-8 text-center text-gray-500">Profile not available</div>;
  }

  const fullName = getRecruiterFullName(recruiter);
  
  const handleViewAllJobs = () => {
    router.push(`/recruiter/app/jobs/${encodeURIComponent(recruiter.userName)}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header/Cover Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-32 relative">
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-8">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {fullName.slice(0, 1).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">{fullName}</h1>
              <p className="text-gray-500">@{recruiter.userName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-16 px-8 pb-8">
        {/* Company Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <Briefcase className="inline-block mr-2 h-5 w-5 text-indigo-500" />
            {recruiter.companyName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">{recruiter.email}</span>
            </div>
            {recruiter.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">{recruiter.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {recruiter.description && editor && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <div className="bg-gray-50 rounded-lg p-4 prose prose-sm max-w-none">
              <div className="ProseMirror">{editor.getHTML()}</div>
            </div>
          </div>
        )}

        {/* Recent Jobs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Jobs</h3>
            <button
              onClick={handleViewAllJobs}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500 border-indigo-200"></div>
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => router.push(`/recruiter/app/jobs/${job.id}`)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">{job.title}</h4>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {job.applicationsCount || 0} applications
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location || 'Remote'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center ml-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500">No jobs created yet</p>
              <button
                onClick={() => router.push('/recruiter/app/jobs/create')}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                Create your first job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}