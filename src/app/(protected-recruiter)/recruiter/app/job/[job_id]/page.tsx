'use client'

import ComingSoon from "@/components/ComingSoon/ComingSoon";
import { useParams } from "next/navigation";

export default function JobPage() {
    const { job_id } = useParams();
    return (
        <div>
            <div>
                Fetching JOB details for {job_id}
            </div>
            <ComingSoon/>
        </div>
)}