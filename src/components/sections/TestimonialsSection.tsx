"use client";

import React from 'react';
import TestimonialCard from "@/components/TestimonialCard";
import { Testimonial } from "@/data/testimonials";

interface TestimonialsSectionProps {
  reviewsRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ reviewsRef, testimonials }: TestimonialsSectionProps) {
  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div 
        ref={reviewsRef}
        className="container mx-auto px-6 animate-on-scroll"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">What Our Members Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join hundreds of professionals who have advanced their careers through our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              position={testimonial.position}
              rating={testimonial.rating}
              imageUrl={testimonial.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}