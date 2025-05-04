'use client';

import { useEffect, useState, useRef } from 'react';

interface AuroraEffectProps {
  className?: string;
  baseHue?: number;
  random?: boolean; 
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}


const randomHue = () => Math.floor(Math.random() * 360);

export default function AuroraEffect({ 
  className = '', 
  baseHue,
  random = false, 
  children,
  size = 'medium'
}: AuroraEffectProps) {
  
  const randomHueRef = useRef<number | null>(null);
  
  
  if (random && randomHueRef.current === null) {
    randomHueRef.current = randomHue();
  }
  
  const [colors, setColors] = useState({
    primary: 0,
    secondary: 0,
    tertiary: 0
  });
  
  useEffect(() => {
    
    
    
    
    const hue = random 
      ? randomHueRef.current! 
      : baseHue !== undefined 
        ? baseHue 
        : randomHue();
    
    setColors({
      primary: hue,
      secondary: (hue + 30) % 360, 
      tertiary: (hue + 60) % 360   
    });
  }, [baseHue, random]);

  
  const gradientSizes = {
    small: {
      primary: 40,
      secondary: 45,
      tertiary: 45
    },
    medium: {
      primary: 50,
      secondary: 60,
      tertiary: 60
    },
    large: {
      primary: 70,
      secondary: 80,
      tertiary: 80
    }
  };

  const sizes = gradientSizes[size];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base layer */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: `hsl(${colors.primary}, 70%, 20%)`
        }}
      />
      
      {/* Aurora layers */}
      <div 
        className="absolute inset-0 w-full h-full aurora-layer-1 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 50%,
              hsla(${colors.primary}, 100%, 60%, 0.8) 0%,
              hsla(${colors.primary}, 100%, 60%, 0) ${sizes.primary}%
            )
          `
        }}
      />
      
      <div 
        className="absolute inset-0 w-full h-full aurora-layer-2 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 30% 70%,
              hsla(${colors.secondary}, 100%, 65%, 0.8) 0%,
              hsla(${colors.secondary}, 100%, 65%, 0) ${sizes.secondary}%
            )
          `
        }}
      />
      
      <div 
        className="absolute inset-0 w-full h-full aurora-layer-3 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 70% 30%,
              hsla(${colors.tertiary}, 100%, 70%, 0.8) 0%,
              hsla(${colors.tertiary}, 100%, 70%, 0) ${sizes.tertiary}%
            )
          `
        }}
      />
      
      {/* Overlay texture */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <div className="absolute inset-0 bg-noise" />
      </div>
      
      {/* Children content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="relative p-2">{children}</div>
        </div>
      )}
      
      <style jsx>{`
        .aurora-layer-1 {
          animation: aurora1 15s ease-in-out infinite alternate;
          transform-origin: center;
        }
        
        .aurora-layer-2 {
          animation: aurora2 18s ease-in-out infinite alternate-reverse;
          transform-origin: center;
        }
        
        .aurora-layer-3 {
          animation: aurora3 21s ease-in-out infinite alternate;
          transform-origin: center;
        }
        
        @keyframes aurora1 {
          0% {
            transform: translate(-10%, -10%) scale(1.2) rotate(0deg);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: translate(5%, 5%) scale(1.3) rotate(2deg);
            filter: hue-rotate(10deg);
          }
          100% {
            transform: translate(-5%, 0%) scale(1.1) rotate(-2deg);
            filter: hue-rotate(20deg);
          }
        }
        
        @keyframes aurora2 {
          0% {
            transform: translate(10%, 0%) scale(1.5) rotate(-2deg);
            filter: hue-rotate(-10deg) brightness(1.1);
          }
          50% {
            transform: translate(5%, -5%) scale(1.4) rotate(0deg);
            filter: hue-rotate(0deg) brightness(0.9);
          }
          100% {
            transform: translate(-5%, 5%) scale(1.6) rotate(2deg);
            filter: hue-rotate(10deg) brightness(1.1);
          }
        }
        
        @keyframes aurora3 {
          0% {
            transform: translate(-5%, 5%) scale(1.4) rotate(2deg);
            filter: hue-rotate(20deg);
          }
          33% {
            transform: translate(10%, -10%) scale(1.3) rotate(-1deg);
            filter: hue-rotate(10deg);
          }
          66% {
            transform: translate(-10%, -5%) scale(1.5) rotate(1deg);
            filter: hue-rotate(0deg);
          }
          100% {
            transform: translate(5%, 10%) scale(1.4) rotate(0deg);
            filter: hue-rotate(-10deg);
          }
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
          background-size: 200px;
        }
      `}</style>
    </div>
  );
}