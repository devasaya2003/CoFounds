'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { fetchWithAuth_POST } from "@/utils/api";
import JobDetails from "@/components/jobs/JobDetails";

interface ApplicationCount {
    total: number;
    applied: number;
    under_review: number;
    inprogress: number;
    rejected: number;
    closed: number;
}

interface JobData {
    fetchedJob: {
        id: string;
        title: string;
        jobCode: string;
        recruiterId: string;
        companyId: string;
        requestedBy: string;
        location: string;
        package: string;
        jobDescription: string;
        assignmentLink: string | null;
        endAt: string;
        createdAt: string;
        updatedAt: string;
        applicationCount: ApplicationCount;
    };
}

export default function JobPage() {
    const { job_id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { userId: recruiterId } = useAppSelector((state) => state.recruiter);
    const recruiterData = useAppSelector((state) => state.recruiter);
    
    // Generate recruiter's full name
    const recruiterName = `${recruiterData.firstName} ${recruiterData.lastName}`.trim();

    useEffect(() => {
        async function fetchJobData() {
            if (!recruiterId || !job_id) return;

            try {
                setIsLoading(true);

                const response = await fetchWithAuth_POST<JobData>('/api/v1/jobs/job', {
                    recruiter_id: recruiterId,
                    job_id: job_id
                });

                console.log('Job data:', response);
                setJobData(response);
            } catch (err) {
                console.error('Error fetching job data:', err);
                setError('Failed to load job data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchJobData();
    }, [job_id, recruiterId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-b-indigo-500 border-indigo-200 mb-4"></div>
                <p className="text-lg text-gray-600">Loading job details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="text-red-500 mb-4">⚠️ {error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!jobData?.fetchedJob) {
        return <div className="p-8 text-center">Job not found</div>;
    }

    return (
        <div className="w-full">
            <JobDetails 
                job={jobData.fetchedJob}
                recruiterName={recruiterName}
            />
        </div>
    );
}