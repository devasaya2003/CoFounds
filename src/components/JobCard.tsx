
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
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({ 
  title, 
  company, 
  location, 
  salary, 
  tags, 
  isNew = false,
  className = ""
}) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-md border border-gray-100 h-full flex flex-col ${className}`}>
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
