import JobCard from "./JobCard";

interface Job {
  id: string;
  title: string;
  jobCode: string;
  recruiterName: string;
  requestedBy: string;
  status: {
    applied: number;
    underReview: number;
    inProgress: number;
    rejected: number;
    closed: number;
  };
}

interface JobListProps {
  jobs: Job[];
}

export default function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <p className="text-lg text-gray-600">No jobs found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}