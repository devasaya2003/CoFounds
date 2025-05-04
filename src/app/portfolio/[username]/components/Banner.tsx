'use client';

import { useEffect, useState, useRef } from 'react';
import AuroraEffect from '@/components/ui/AuroraEffect';

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

export default function Banner() {  
  const [image, setImage] = useState<BannerImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const bannerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        setIsLoading(true);
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
        const response = await fetch(`${BASE_URL}/api/banner-image`);
                
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
      className="relative w-full h-64 bg-gray-900 overflow-hidden"
    >
      {/* Fallback aurora effect when image is loading or failed */}
      {(!image?.url || isLoading) && (
        <AuroraEffect 
          size="large" 
          className="h-full"
          random={true}
        >
          {/* Loading message overlay - Now explicitly styled for visibility */}
          <div className="text-center text-white">
            <p className="text-xl font-medium animate-pulse drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
              Brewing an awesome image for you
            </p>
            <p className="text-sm mt-1 opacity-80 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
              -Pexels
            </p>
          </div>
        </AuroraEffect>
      )}
      
      {/* Random image from Pexels */}
      {image?.url && (
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url("${image.url}")` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" /> {/* Darken overlay */}
          
          {/* Photo credit with proper styling and ensured clickability */}
          {image.photographer && (
            <div className="absolute bottom-2 right-3 px-2 py-1 rounded text-xs text-white bg-black bg-opacity-30 backdrop-blur-sm z-10">
              <span className="flex items-center">
                By{" "}
                <a 
                  href={image.photographerUrl || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline mx-1 text-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {image.photographer}
                </a>
                {" "}|{" "}
                <a 
                  href="https://www.pexels.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline mx-1 text-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Pexels
                </a>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}