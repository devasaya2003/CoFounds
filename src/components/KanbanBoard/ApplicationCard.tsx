'use client';

import { useDrag } from 'react-dnd';
import { useRef } from 'react';
import { Application, ApplicationStatus } from './types';
import { CalendarDays, MapPin, Package, Building, Trash2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../ui/select';

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onDelete?: (applicationId: string) => void;
}

export default function ApplicationCard({ application, onStatusChange, onDelete }: ApplicationCardProps) {
  // Create a ref that we'll combine with the drag ref
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, connectDrag] = useDrag({
    type: 'APPLICATION',
    item: { id: application.id, status: application.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Connect the drag ref to our element when the component mounts
  connectDrag(cardRef);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'applied':
        return 'border-blue-500 shadow-blue-500/10';
      case 'under_review':
        return 'border-yellow-500 shadow-yellow-500/10';
      case 'inprogress':
        return 'border-purple-500 shadow-purple-500/10';
      case 'rejected':
        return 'border-red-500 shadow-red-500/10';
      case 'closed':
        return 'border-green-500 shadow-green-500/10';
      default:
        return 'border-gray-300';
    }
  };

  const showDeleteButton = application.status === 'rejected' || application.status === 'closed';

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-md shadow-sm p-4 border-l-4 ${getStatusColor()}
        transition-all duration-200 cursor-grab hover:shadow-md
        ${isDragging ? 'opacity-50 shadow-lg rotate-3' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate text-sm">{application.job.title}</h3>
          <div className="flex items-center text-xs text-gray-600 mt-1">
            <Building className="h-3.5 w-3.5 mr-1 text-gray-400" />
            <span className="truncate">{application.job.company.name}</span>
          </div>
        </div>
        
        {showDeleteButton && onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(application.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
          <span className="truncate">{application.job.location}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
        <div className="flex items-center text-gray-600">
          <Package className="h-3 w-3 mr-1 text-gray-400" />
          <span className="truncate">{application.job.package}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <CalendarDays className="h-3 w-3 mr-1 text-gray-400" />
          <span>{formatDate(application.updatedAt)}</span>
        </div>

        <Select
          defaultValue={application.status}
          onValueChange={(value) => {
            if (value !== application.status) {
              onStatusChange(application.id, value as ApplicationStatus);
            }
          }}
        >
          <SelectTrigger className="w-[120px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="applied" className="text-xs">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                  Applied
                </div>
              </SelectItem>
              <SelectItem value="under_review" className="text-xs">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  Review
                </div>
              </SelectItem>
              <SelectItem value="inprogress" className="text-xs">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  In Progress
                </div>
              </SelectItem>
              <SelectItem value="rejected" className="text-xs">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  Rejected
                </div>
              </SelectItem>
              <SelectItem value="closed" className="text-xs">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  Closed
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}