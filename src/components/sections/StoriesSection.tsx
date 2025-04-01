"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import StoryCard from "@/components/StoryCard";
import { Story } from "@/data/stories";

interface StoriesSectionProps {
  storiesRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
  stories: Story[];
}

export default function StoriesSection({ storiesRef, stories }: StoriesSectionProps) {
  return (
    <section id="stories" className="py-20 bg-pattern-dots">
      <div 
        ref={storiesRef}
        className="container mx-auto px-6 animate-on-scroll"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl">
              Real experiences from members who transformed their careers through our community.
            </p>
          </div>
          <Button 
            variant="link" 
            className="hidden md:flex items-center mt-4 md:mt-0 text-black"
          >
            View all stories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <StoryCard
              key={index}
              title={story.title}
              excerpt={story.excerpt}
              imageUrl={story.imageUrl}
              author={story.author}
              date={story.date}
            />
          ))}
        </div>
        
        <div className="flex md:hidden justify-center mt-8">
          <Button variant="link" className="flex items-center text-black">
            View all stories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}