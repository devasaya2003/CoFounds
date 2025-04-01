
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface StoryCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  excerpt,
  imageUrl,
  author,
  date
}) => {
  return (
    <Card className="border-0 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-6 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        <button className="flex items-center text-xs font-medium hover:underline">
          Read Story
          <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
