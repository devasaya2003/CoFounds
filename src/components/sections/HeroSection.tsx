"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronDown } from "lucide-react";
import { JoinCommunity } from '@/app/utils/joinCommunity';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
  heroRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-b from-blue-50 to-purple-50 rounded-bl-full opacity-70 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-yellow-50 to-transparent rounded-tr-full opacity-70 -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-100 blob opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-100 blob opacity-30 -z-10"></div>
      
      <div 
        ref={heroRef}
        className="container mx-auto text-center relative z-10 animate-on-scroll"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight max-w-4xl mx-auto mb-6">
          Find Your Dream Role Based On Your <span className="text-gradient">Real Work</span> & Community
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Join our vibrant community where your actual work speaks louder than resumes. Connect with forward-thinking companies seeking proven talent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 px-6 border-0"
          onClick={JoinCommunity}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Join Our WhatsApp Community
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => scrollToSection('jobs')}
            className="border-gray-300 hover:border-gray-400 px-6"
          >
            Browse Open Positions
          </Button>
        </div>
        
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => scrollToSection('jobs')} 
            className="flex flex-col items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="mb-2">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}