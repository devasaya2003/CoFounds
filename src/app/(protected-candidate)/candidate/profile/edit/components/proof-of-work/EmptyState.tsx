// filepath: /home/devasaya/Desktop/co_founds/CoFounds/src/app/(protected-candidate)/candidate/profile/edit/components/proof-of-work/EmptyState.tsx
import { Button } from '@/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddProofOfWork: () => void;
}

const EmptyState = ({ onAddProofOfWork }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Briefcase className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No work experience added yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Add your work experience and community contributions to showcase your professional journey.
      </p>
      <Button onClick={onAddProofOfWork} className="flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
};

export default EmptyState;