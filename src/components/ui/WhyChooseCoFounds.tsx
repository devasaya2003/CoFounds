"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component

export default function WhyChooseUs() {
  return (
    <div className="w-full  md:px-44 px-5 py-10">
      <div className="w-full py-5 text-center">
        <span className="text-white md:text-7xl text-4xl   font-exconmedium">
          Why CoFounds.
        </span>
      </div>
      {/* Job Seekers Section */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-0">
        <div className="w-full md:w-1/2 bg-[#F4F7FA] p-8 sm:p-12 lg:p-16 rounded-lg md:rounded-r-none">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#162D67] mb-6">
            Got talent?
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#162D67] mb-8">
            Why job seekers love us
          </h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="text-[#162D67] mr-4">✔</span>
              <p className="text-lg">
                Connect directly with founders at top startups - no third-party
                recruiters allowed.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-[#162D67] mr-4">✔</span>
              <p className="text-lg">
                Everything you need to know, all upfront. View salary, stock
                options, and more before applying.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-[#162D67] mr-4">✔</span>
              <p className="text-lg">
                Say goodbye to cover letters - your profile is all you need. One
                click to apply and you&apos;re done.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-[#162D67] mr-4">✔</span>
              <p className="text-lg">
                Unique jobs at startups and tech companies you can&apos;t find
                anywhere else.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-[#162D67] mr-4">✔</span>
              <p className="text-lg">
                Unique jobs at startups and tech companies you can&apos;t find
                anywhere else.
              </p>
            </li>
          </ul>
          <div className="flex space-x-4">
            <Button className="bg-[#162D67] text-white px-8 py-3 rounded-lg hover:bg-[#0E1F4D] transition-colors duration-300">
              Learn More
            </Button>
            <Button className="bg-transparent border border-[#162D67] text-[#162D67] px-8 py-3 rounded-lg hover:bg-[#162D67] hover:text-white transition-colors duration-300">
              Sign Up
            </Button>
          </div>
        </div>

        {/* Recruiters Section */}
        <div className="w-full md:w-1/2 bg-[#162D67] p-8 sm:p-12 lg:p-16 rounded-lg md:rounded-l-none">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Need talent?
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
            Why recruiters love us
          </h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="text-white mr-4">✔</span>
              <p className="text-lg text-white">
                Tap into a community of 10M+ engaged, startup-ready candidates.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">✔</span>
              <p className="text-lg text-white">
                Everything you need to kickstart your recruiting — set up job
                posts, company branding, and HR tools within 10 minutes, all for
                free.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">✔</span>
              <p className="text-lg text-white">
                A free applicant tracking system, or free integration with any
                ATS you may already use.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">✔</span>
              <p className="text-lg text-white">
                Let us handle the heavy-lifting with RecruiterCloud. Our new
                AI-Recruiter scans 500M+ candidates, filters it down based on
                your unique calibration, and schedules your favorites on your
                calendar in a matter of days.
              </p>
            </li>
          </ul>
          <div className="flex space-x-4">
            <Button className="bg-white text-[#162D67] px-8 py-3 rounded-lg hover:bg-[#F4F7FA] transition-colors duration-300">
              Learn More
            </Button>
            <Button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#162D67] transition-colors duration-300">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
