"use client";

import React, { useRef } from 'react';
import { scrollToSection as scrollTo } from '@/utils/scrollUtils';

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
  
  const heroRef = useRef<HTMLDivElement | null>(null);
  const jobsRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const storiesRef = useRef<HTMLDivElement | null>(null);

  
  const renderProps: ScrollRefs = {
    heroRef,
    jobsRef,
    reviewsRef,
    storiesRef,
    scrollToSection: scrollTo
  };

  return <>{children(renderProps)}</>;
}