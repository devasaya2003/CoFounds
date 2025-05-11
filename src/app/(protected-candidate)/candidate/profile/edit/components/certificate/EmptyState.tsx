'use client';

import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    onAddCertificate: () => void;
}

// Use memo to prevent unnecessary re-renders
const EmptyState = memo(({ onAddCertificate }: EmptyStateProps) => (
    <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-300">
        <h3 className="font-medium text-lg mb-2">No certificates added yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Showcase your qualifications and credentials to stand out to potential employers.
        </p>
        <Button
            onClick={onAddCertificate}
            variant="outline"
            className="flex items-center mx-auto"
        >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Certificate
        </Button>
    </div>
));

EmptyState.displayName = 'EmptyState';
export default EmptyState;