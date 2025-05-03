'use client';

import { useDrop } from 'react-dnd';
import { useRef } from 'react';
import ApplicationCard from './ApplicationCard';
import { ApplicationStatus, KanbanColumnProps } from './types';

export default function KanbanColumn({
  title,
  status,
  applications,
  onStatusChange,
  onDelete
}: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, connectDrop] = useDrop({
    accept: 'APPLICATION',
    drop: (item: { id: string; status: ApplicationStatus }) => {
      if (item.status !== status) {
        onStatusChange(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  connectDrop(columnRef);

  const getBadgeColor = () => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 ring-blue-600/20';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      case 'inprogress':
        return 'bg-purple-100 text-purple-800 ring-purple-600/20';
      case 'rejected':
        return 'bg-red-100 text-red-800 ring-red-600/20';
      case 'closed':
        return 'bg-green-100 text-green-800 ring-green-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-gray-600/20';
    }
  };

  const getColumnHighlightColor = () => {
    switch (status) {
      case 'applied':
        return 'ring-blue-500/50';
      case 'under_review':
        return 'ring-yellow-500/50';
      case 'inprogress':
        return 'ring-purple-500/50';
      case 'rejected':
        return 'ring-red-500/50';
      case 'closed':
        return 'ring-green-500/50';
      default:
        return 'ring-gray-400/50';
    }
  };

  return (
    <div 
      ref={columnRef}
      className={`bg-gray-50 rounded-lg p-3 w-80 min-w-[320px] flex flex-col
        transition-all duration-150 shadow-sm
        ${isOver ? `bg-gray-100 ring-2 ${getColumnHighlightColor()}` : 'ring-1 ring-gray-200'}
      `}
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-medium text-gray-700 flex items-center">
          <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ring-1 ring-inset ${getBadgeColor()} mr-2`}>
            {applications.length}
          </span>
          {title}
        </h3>
      </div>

      <div className="flex-grow space-y-3">
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg p-4 border border-dashed border-gray-300 text-center text-gray-500 text-sm">
            Drop applications here
          </div>
        ) : (
          applications.map(application => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}

        {isOver && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50/50 text-center text-sm text-gray-500 mt-3">
            Drop to move here
          </div>
        )}
      </div>
    </div>
  );
}