"use client";

import React, { useEffect } from 'react';

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  // Initialize scroll animations
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      elements.forEach(element => {
        observer.observe(element);
      });

      return () => {
        elements.forEach(element => {
          observer.unobserve(element);
        });
      };
    };

    animateElements();
  }, []);

  return <>{children}</>;
}