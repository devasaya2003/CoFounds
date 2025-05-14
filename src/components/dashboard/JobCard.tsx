import { Job } from "@/types/job";
import Link from 'next/link';
import StatusBadge from '@/components/common/status_badge';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const getRecruiterFullName = () => {
    if (job.recruiter.firstName || job.recruiter.lastName) {
      return `${job.recruiter.firstName || ""} ${job.recruiter.lastName || ""}`.trim();
    }
    return job.recruiter.userName || "";
  };

  return (
    <Link href={`/recruiter/app/job/${job.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-xs text-gray-500 mb-3">Job Code: {job.jobCode}</p>
          
          <div className="mb-2">
            <span className="text-sm text-gray-600">Created By: </span>
            <span className="text-sm font-medium text-gray-900">{getRecruiterFullName()}</span>
          </div>
          
          <div className="mb-4">
            <span className="text-sm text-gray-600">Requested By: </span>
            <span className="text-sm font-medium text-gray-900">{job.requestedBy}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <StatusBadge label="Applied" count={job.statusCounts.applied} color="blue" />
            <StatusBadge label="Under-Review" count={job.statusCounts.under_review} color="orange" />
            <StatusBadge label="In-Progress" count={job.statusCounts.inprogress} color="gray" />
            <StatusBadge label="Rejected" count={job.statusCounts.rejected} color="red" />
            <StatusBadge label="Closed" count={job.statusCounts.closed} color="green" />
          </div>
        </div>
      </div>
    </Link>
  );
}