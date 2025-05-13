'use client';

import { useEffect, useState, useRef } from 'react';
import AuroraEffect from '@/components/ui/AuroraEffect';
import { ArrowRight, Camera } from 'lucide-react';

interface BannerImage {
  url: string | null;
  photographer: string | null;
  photographerUrl: string | null;
}

const fallbackImages = [
  {
    url: "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg",
    photographer: "𝗛&𝗖𝗢 　",
    photographerUrl: "https://www.pexels.com/@hngstrm"
  },
  {
    url: "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg",
    photographer: "Miguel Á. Padriñán",
    photographerUrl: "https://www.pexels.com/@padrinan"
  }
];

// Extracted wave component to reuse in both states
const WaveOverlay = () => (
  <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden z-10" style={{ height: '40px' }}>
    <svg 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none" 
      className="absolute bottom-0 w-full h-full" 
      style={{ transform: 'rotate(180deg)' }}
    >
      <path 
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
        className="fill-white dark:fill-gray-900"
        opacity=".25"
      ></path>
      <path 
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
        className="fill-white dark:fill-gray-900"
        opacity=".5"
      ></path>
      <path 
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
        className="fill-white dark:fill-gray-900"
      ></path>
    </svg>
  </div>
);

// Decorative accent line component
const AccentLine = () => (
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
);

export default function Banner() {  
  const [image, setImage] = useState<BannerImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current && window.scrollY < 500) {
        // Move the background image slightly when scrolling
        const yPos = window.scrollY * 0.2;
        imageRef.current.style.transform = `translateY(${yPos}px) scale(1.1)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/banner-image`);
                
        if (!response.ok) throw new Error(`Failed to fetch banner image: ${response.status}`);
        
        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }
        
        setImage(data);
      } catch (error) {
        console.error('Error loading banner image:', error);
        
        const randomIndex = Math.floor(Math.random() * fallbackImages.length);
        setImage(fallbackImages[randomIndex]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    
    fetchRandomImage();
  }, []);

  return (
    <div 
      ref={bannerRef} 
      className="relative w-full h-80 md:h-96 overflow-hidden"
    >
      {/* Fallback aurora effect when image is loading or failed */}
      {(!image?.url || isLoading) && (
        <div className="relative h-full">
          <AuroraEffect 
            size="large" 
            className="h-full"
            random={true}
          >
            {/* Loading message overlay with improved styling */}
            <div className="text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-xl font-medium drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
                Creating your showcase
              </p>
              <p className="text-sm mt-1 opacity-80 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
                Powered by Pexels
              </p>
            </div>
          </AuroraEffect>
          
          {/* Add wave and accent line to loading state too */}
          <AccentLine />
          <WaveOverlay />
        </div>
      )}
      
      {/* Random image from Pexels with enhanced styling */}
      {image?.url && (
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          <div 
            ref={imageRef}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-out scale-110"
            style={{ backgroundImage: `url("${image.url}")` }}
          />
          
          {/* Enhanced gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          
          {/* Decorative accent line at bottom */}
          <AccentLine />
          
          {/* Wave overlay */}
          <WaveOverlay />
          
          {/* Improved photo credit with icon and styling */}
          {image.photographer && (
            <div className="absolute bottom-6 right-3 px-3 py-1.5 rounded-full text-xs text-white bg-black/40 backdrop-blur-sm z-10 flex items-center gap-1.5 transition-all duration-300 hover:bg-black/60">
              <Camera size={12} />
              <a 
                href={image.photographerUrl || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {image.photographer}
              </a>
              
              <span className="mx-1 text-gray-300">|</span>
              
              <a 
                href="https://www.pexels.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 group"
                onClick={(e) => e.stopPropagation()}
              >
                Pexels
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}