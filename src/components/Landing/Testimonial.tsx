"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component
import { Reviews } from "./InfiniteCarousel";

export default function SuccessStories() {
  return (
    <div className="w-full  py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-5 rounded-2xl flex flex-col justify-center align-middle items-center">
        {/* Headline */}
        <h2 className="sm:text-4xl lg:text-6xl font-bold text-center  md:mb-8 max-w-5xl text-white md:text-7xl text-4xl   font-exconmedium">
          Join Thousands Who Found Their Dream Job
        </h2>

        {/* Testimonials Grid */}
        <Reviews />

        {/* Stats Section */}
        <div className="text-center md:mb-12  text-white py-10">
          <h3 className="text-2xl md:text-5xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-4xl font-bold text-blue-600  md:text-5xl ">
                10,000+
              </p>
              <p className="text-lg">Hires Made</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600  md:text-5xl ">
                95%
              </p>
              <p className="text-lg">Candidate Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600  md:text-5xl ">
                500M+
              </p>
              <p className="text-lg">Candidates Scanned</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-[#0E1F4D] transition-colors duration-300 text-lg md:text-xl font-semibold">
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}
