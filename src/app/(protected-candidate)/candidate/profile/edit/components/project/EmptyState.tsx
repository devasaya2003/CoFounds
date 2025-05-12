import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddProject: () => void;
}

export default function EmptyState({ onAddProject }: EmptyStateProps) {
  return (
    <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg bg-gray-50">
      <div className="mx-auto w-12 h-12 bg-blue-50 flex items-center justify-center rounded-full mb-4">
        <FolderKanban className="h-6 w-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        No projects added yet
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Showcase your portfolio by adding projects you've built or contributed to.
      </p>
      <Button onClick={onAddProject} className="flex items-center mx-auto">
        <Plus className="h-4 w-4 mr-1" />
        Add Project
      </Button>
    </div>
  );
}