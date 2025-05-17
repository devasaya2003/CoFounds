'use client';

interface BannerProps {
  username: string;
}

// Hash function to convert username to a numeric value
function hashUsername(username: string): number {
  return username.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
}

// Generate a light/pastel color from a seed value
function generatePastelColor(seed: number): string {
  // Ensure high lightness (pastel) by using HSL color model
  const hue = seed % 360;
  // Keep saturation and lightness in ranges that produce light colors
  const saturation = 70; // Moderate saturation
  const lightness = 85;  // High lightness for pastel colors
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Generate a gradient style from a username
function generateGradient(username: string): string {
  const hash = hashUsername(username);
  
  // Generate two different hues for a nicer gradient
  const color1 = generatePastelColor(hash);
  const color2 = generatePastelColor(hash + 140); // Offset for complementary color
  
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}

export default function Banner({ username }: BannerProps) {  
  // Calculate the gradient style
  const gradientStyle = {
    background: generateGradient(username)
  };
  
  return (
    <div 
      className="relative w-full h-40 overflow-hidden"
      style={gradientStyle}
    >
      {/* Username-based gradient banner */}
    </div>
  );
}