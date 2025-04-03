"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import JobCard from "@/components/JobCard";
import { Job } from "@/data/jobs";
import { OpenPositions } from '@/app/utils/openPositions';

interface JobsSectionProps {
  jobsRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
  jobs: Job[];
}

export default function JobsSection({ jobsRef, jobs }: JobsSectionProps) {
  return (
    <section id="jobs" className="py-20 bg-pattern-dots">
      <div 
        ref={jobsRef}
        className="container mx-auto px-6 animate-on-scroll"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold mb-4">Open Positions</h2>
            <p className="text-gray-600 max-w-2xl">
              Exclusive opportunities from companies that value demonstrated skills and real-world experience.
            </p>
          </div>
          <Button 
            variant="link" 
            className="hidden md:flex items-center mt-4 md:mt-0 text-black"
            onClick={OpenPositions}
          >
            View all positions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              tags={job.tags}
              isNew={job.isNew}
              colorIndex={index}
              applicationLink={job.application_link}
            />
          ))}
        </div>
        
        <div className="flex md:hidden justify-center mt-8">
          <Button variant="link" className="flex items-center text-black">
            View all positions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}