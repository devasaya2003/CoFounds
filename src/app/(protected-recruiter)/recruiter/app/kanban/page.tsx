'use client';

import KanbanBoard from '@/components/KanbanBoard/KanbanBoard';

export default function KanbanRecruiterPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Application Kanban Board</h1>
      </div>
      <KanbanBoard />
    </div>
  );
}