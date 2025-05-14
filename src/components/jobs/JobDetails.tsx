import Link from "next/link";
import StatusBadge from "@/components/common/status_badge";

interface ApplicationCount {
    total: number;
    applied: number;
    under_review: number;
    inprogress: number;
    rejected: number;
    closed: number;
}

interface JobDetailsProps {
    job: {
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
    recruiterName: string;
}

export default function JobDetails({ job, recruiterName }: JobDetailsProps) {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        return `${day}${getDaySuffix(day)} ${month}, ${year}`;
    };

    const getDaySuffix = (day: number): string => {
        if (day > 3 && day < 21) return 'th';

        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return (
        <div className="border rounded-lg shadow px-4 py-5 sm:px-6">
            {/* Header with job title and kanban button */}
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <Link href={`/recruiter/app/kanban/${job.id}`}>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
                        See Applications in Kanban
                    </button>
                </Link>
            </div>

            {/* Job Code */}
            <div className="mb-2">
                <span className="text-gray-600 font-medium">Job Code:</span> {job.jobCode}
            </div>

            {/* Total Applications */}
            <div className="mb-2">
                <span className="text-gray-600 font-medium">Total Applications:</span> {job.applicationCount.total}
            </div>

            {/* Created By */}
            <div className="mb-2">
                <span className="text-gray-600 font-medium">Created By:</span> {recruiterName}
            </div>

            {/* Requested By */}
            <div className="mb-2">
                <span className="text-gray-600 font-medium">Requested By:</span> {job.requestedBy}
            </div>

            <div className="mb-2">
                <span className="text-gray-600 font-medium">Location:</span> {job.location}
            </div>

            <div className="mb-4">
                <span className="text-gray-600 font-medium">Package:</span> ₹{parseInt(job.package).toLocaleString()}
            </div>

            {/* Status badges */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Application Status</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <StatusBadge label="Applied" count={job.applicationCount.applied} color="blue" />
                    <StatusBadge label="Under-Review" count={job.applicationCount.under_review} color="orange" />
                    <StatusBadge label="In-Progress" count={job.applicationCount.inprogress} color="gray" />
                    <StatusBadge label="Rejected" count={job.applicationCount.rejected} color="red" />
                    <StatusBadge label="Closed" count={job.applicationCount.closed} color="green" />
                </div>
            </div>

            {/* Status expiry */}
            <div className="mb-5">
                <div className="flex flex-wrap gap-3">
                    {new Date(job.endAt) > new Date() ? (
                        <>
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Open</div>
                            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                                Expires: {formatDate(job.endAt)}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded">Closed</div>
                            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                                Expired: {formatDate(job.endAt)}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-4">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Description</h2>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                />
            </div>
        </div>
    );
}