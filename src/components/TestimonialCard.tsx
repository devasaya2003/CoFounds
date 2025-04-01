
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  author: string;
  position: string;
  rating: number;
  imageUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  author,
  position,
  rating,
  imageUrl
}) => {
  return (
    <Card className="border-0 shadow-sm bg-white h-full flex flex-col">
      <CardContent className="pt-6 pb-6 flex flex-col h-full">
        <div className="flex mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current text-black" />
          ))}
        </div>
        
        <p className="text-gray-700 mb-6 flex-grow">"{content}"</p>
        
        <div className="flex items-center mt-auto">
          {imageUrl && (
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img 
                src={imageUrl} 
                alt={author} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{author}</p>
            <p className="text-gray-500 text-xs">{position}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;