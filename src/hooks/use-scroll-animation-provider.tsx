"use client";

import React, { useRef } from 'react';
import { scrollToSection as scrollTo } from '@/utils/scrollUtils';

// Create a type that matches what useRef actually returns
type ScrollRefs = {
  heroRef: React.MutableRefObject<HTMLDivElement | null>;
  jobsRef: React.MutableRefObject<HTMLDivElement | null>;
  reviewsRef: React.MutableRefObject<HTMLDivElement | null>;
  storiesRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollToSection: (id: string) => void;
}

interface ScrollAnimationProviderProps {
  children: (props: ScrollRefs) => React.ReactNode;
}

export default function ScrollAnimationProvider({ children }: ScrollAnimationProviderProps) {
  // Create refs with correct types
  const heroRef = useRef<HTMLDivElement | null>(null);
  const jobsRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const storiesRef = useRef<HTMLDivElement | null>(null);

  // Create an object to pass to children
  const renderProps: ScrollRefs = {
    heroRef,
    jobsRef,
    reviewsRef,
    storiesRef,
    scrollToSection: scrollTo
  };

  return <>{children(renderProps)}</>;
}