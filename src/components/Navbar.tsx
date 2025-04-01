"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-8 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-xl font-display font-bold text-gradient">Cofounds</a>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <button 
            onClick={() => scrollToSection('jobs')}
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            Jobs
          </button>
          <button 
            onClick={() => scrollToSection('reviews')}
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            Reviews
          </button>
          <button 
            onClick={() => scrollToSection('stories')}
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            Stories
          </button>
        </div>
        
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 border-0">
          <MessageSquare className="h-4 w-4 mr-2" />
          Join Community
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
