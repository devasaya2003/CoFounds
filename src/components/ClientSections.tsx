"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { jobs } from "@/data/jobs";
import { testimonials } from "@/data/testimonials";
// import { stories } from "@/data/stories";
import Footer from './Footer';

const AnimationProvider = dynamic(() => import('@/components/AnimationProvider'), { 
  ssr: true,
  loading: () => <div></div>
});

const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { 
  ssr: true,
  loading: () => <div></div>
});

const JobsSection = dynamic(() => import('@/components/sections/JobsSection'), { 
  ssr: true,
  loading: () => <div></div>
});

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), { 
  ssr: true,
  loading: () => <div></div>
});

// const StoriesSection = dynamic(() => import('@/components/sections/StoriesSection'), { 
//   ssr: true,
//   loading: () => <div></div>
// });

const CTASection = dynamic(() => import('@/components/sections/CTASection'), { 
  ssr: true,
  loading: () => <div></div>
});

const ScrollAnimationHook = dynamic(() => import('@/hooks/use-scroll-animation-provider'), { 
  ssr: true,
  loading: () => <div></div>
});

export default function ClientSections() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleError = (error: Error) => {
    console.error("Error in ClientSections:", error);
    setHasError(true);
    setErrorMessage(error.toString());
  };

  if (hasError) {
    return (
      <div className="p-10 border border-red-300 bg-red-50 m-4 rounded">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Rendering Sections</h2>
        <p className="mb-4">There was an error rendering the page sections:</p>
        <pre className="bg-white p-4 rounded text-sm overflow-auto">{errorMessage}</pre>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!isClient) {
    return <div></div>;
  }

  try {
    return (
      <>
        <AnimationProvider>
          <ScrollAnimationHook>
            {({ heroRef, jobsRef, reviewsRef, storiesRef, scrollToSection }) => {
              try {
                return (
                  <>
                    <HeroSection 
                      heroRef={heroRef}
                      scrollToSection={scrollToSection}
                    />
                    
                    <JobsSection 
                      jobsRef={jobsRef}
                      jobs={jobs}
                    />
                    
                    <TestimonialsSection
                      reviewsRef={reviewsRef}
                      testimonials={testimonials}
                    />
                    
                    <CTASection />
                  </>
                );
              } catch (error) {
                console.error("Error rendering section children:", error);
                handleError(error instanceof Error ? error : new Error(String(error)));
                return null;
              }
            }}
          </ScrollAnimationHook>
        <Footer />
        </AnimationProvider>
      </>
    );
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}