"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component
import {
  Briefcase,
  Search,
  CheckCircle,
  Users,
  Clock,
  BarChart2,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="w-full bg-[#F4F7FA] py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#162D67] text-center mb-8">
          How It Works
        </h2>

        {/* Job Seekers Section */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#162D67] text-center mb-8">
            How to Land Your Dream Job in 3 Easy Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <Search size={48} className="text-[#162D67]" />
              </div>
              <h4 className="text-xl font-bold mb-2">1. Create Your Profile</h4>
              <p className="text-sm">
                Build a standout profile showcasing your skills, experience, and
                career goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <Briefcase size={48} className="text-[#162D67]" />
              </div>
              <h4 className="text-xl font-bold mb-2">2. Browse Jobs</h4>
              <p className="text-sm">
                Explore thousands of job listings from top startups and tech
                companies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle size={48} className="text-[#162D67]" />
              </div>
              <h4 className="text-xl font-bold mb-2">3. Apply in One Click</h4>
              <p className="text-sm">
                No cover letters needed! Apply to jobs with just one click.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Button className="bg-[#162D67] text-white px-8 py-3 rounded-lg hover:bg-[#0E1F4D] transition-colors duration-300">
              Get Started Now
            </Button>
          </div>
        </div>

        {/* Employers Section */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#162D67] text-center mb-8">
            Hire Top Talent in Just 3 Simple Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <Users size={48} className="text-[#162D67]" />
              </div>
              <h4 className="text-xl font-bold mb-2">1. Post a Job</h4>
              <p className="text-sm">
                Create a job listing in minutes and reach 10M+ candidates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <Clock size={48} className="text-[#162D67]" />
              </div>
              <h4 className="text-xl font-bold mb-2">2. Review Candidates</h4>
              <p className="text-sm">
                Use our AI-powered tools to filter and shortlist the best
                candidates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <BarChart2 size={48} className="text-[#162D67]" />
              </div>
              <h4 className="text-xl font-bold mb-2">3. Hire the Best</h4>
              <p className="text-sm">
                Schedule interviews and make offers seamlessly through our
                platform.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Button className="bg-[#162D67] text-white px-8 py-3 rounded-lg hover:bg-[#0E1F4D] transition-colors duration-300">
              Post a Job Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
