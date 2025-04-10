import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Create a helper function to get the recruiter's full name
  const getRecruiterFullName = () => {
    if (job.recruiter.firstName || job.recruiter.lastName) {
      return `${job.recruiter.firstName || ""} ${job.recruiter.lastName || ""}`.trim();
    }
    return job.recruiter.userName || "";
  };

  return (
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
  );
}

interface StatusBadgeProps {
  label: string;
  count: number;
  color: 'blue' | 'orange' | 'gray' | 'red' | 'green';
}

function StatusBadge({ label, count, color }: StatusBadgeProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
  };
  
  return (
    <div className={`rounded-lg px-2 py-1 text-center ${colorClasses[color]}`}>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-sm font-semibold">{count}</div>
    </div>
  );
}