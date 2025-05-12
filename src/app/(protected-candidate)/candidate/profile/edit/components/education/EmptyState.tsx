import { GraduationCap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddEducation: () => void;
}

export default function EmptyState({ onAddEducation }: EmptyStateProps) {
  return (
    <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg bg-gray-50">
      <div className="mx-auto w-12 h-12 bg-blue-50 flex items-center justify-center rounded-full mb-4">
        <GraduationCap className="h-6 w-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        No education entries yet
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Add your educational background to help employers understand your qualifications.
      </p>
      <Button onClick={onAddEducation} className="flex items-center mx-auto">
        <Plus className="h-4 w-4 mr-1" />
        Add Education
      </Button>
    </div>
  );
}