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
import { OpenPositions } from '@/app/utils/openPositions';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  isNew?: boolean;
  colorIndex: number;
}

const colorOptions = [
  'bg-blue-50 border-blue-100',
  'bg-purple-50 border-purple-100',
  'bg-green-50 border-green-100',
  'bg-pink-50 border-pink-100',
  'bg-yellow-50 border-yellow-100',
  'bg-indigo-50 border-indigo-100',
  'bg-red-50 border-red-100',
  'bg-teal-50 border-teal-100',
  'bg-orange-50 border-orange-100',
  'bg-cyan-50 border-cyan-100'
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
        <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={OpenPositions}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
