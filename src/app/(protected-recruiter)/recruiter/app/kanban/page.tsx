import KanbanBoard from '@/components/KanbanBoard/KanbanBoard';

export default function KanbanRecruiterPage() {
  return (
    <div className="h-full w-full">
                <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Application Kanban Board</h1>
          </div>
      <KanbanBoard />
    </div>
  );
}