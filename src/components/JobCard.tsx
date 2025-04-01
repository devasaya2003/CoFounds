import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  isNew?: boolean;
  colorIndex: number; // Add colorIndex prop
}

// Define an array of 10 different color combinations
const colorOptions = [
  'bg-blue-50 border-blue-100',       // Light blue
  'bg-purple-50 border-purple-100',   // Light purple
  'bg-green-50 border-green-100',     // Light green
  'bg-pink-50 border-pink-100',       // Light pink
  'bg-yellow-50 border-yellow-100',   // Light yellow
  'bg-indigo-50 border-indigo-100',   // Light indigo
  'bg-red-50 border-red-100',         // Light red
  'bg-teal-50 border-teal-100',       // Light teal
  'bg-orange-50 border-orange-100',   // Light orange
  'bg-cyan-50 border-cyan-100'        // Light cyan
];

const JobCard: React.FC<JobCardProps> = ({ 
  title, 
  company, 
  location, 
  salary, 
  tags, 
  isNew = false,
  colorIndex
}) => {
  // Get color from colorOptions array using modulo to ensure it wraps around
  const cardColor = colorOptions[colorIndex % colorOptions.length];
  
  return (
    <Card className={`transition-all duration-300 hover:shadow-md h-full flex flex-col ${cardColor}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{company}</p>
          </div>
          {isNew && (
            <Badge className="bg-black text-white hover:bg-black/90">New</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex space-x-4 text-sm text-gray-500 mb-3">
          <span>{location}</span>
          <span>{salary}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" className="w-full">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
